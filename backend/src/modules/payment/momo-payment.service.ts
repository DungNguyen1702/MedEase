import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AppointmentRequest } from '../appointment/dtos/AppointmentRequest';
import { OrderPaymentMethodEnum } from '../../common/enums';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { AppointmentService } from '../appointment/appointment.service';
import * as crypto from 'crypto';
import { Account } from '../../schemas';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';

@Injectable()
export class MomoPaymentService {
  constructor(
    private configService: ConfigService,
    private readonly appService: AppointmentService
  ) {}
  async createPayment(
    body: AppointmentRequest,
    @CurrentAccount() currentAccount: Account
  ) {
    const {
      totalPrice,
      rootRedirectUrl,
      appointment_detail,
      appointment_date,
      time,
    } = body;

    const currentTime = moment(
      `${appointment_date} ${time}`,
      'YYYY-MM-DD HH:mm'
    );

    for (const detail of appointment_detail) {
      const { specialization_id, doctor_id } = detail;

      await this.appService.checkAndAssignDoctor(
        doctor_id,
        specialization_id,
        appointment_date,
        currentTime.clone()
      );
    }

    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const orderInfo = 'pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = rootRedirectUrl;
    const ipnUrl = process.env.DEPLOY_SERVICE_LINK + '/momo-payment/callback';
    const requestType = 'payWithMethod';
    const amount = `${totalPrice}`;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const dataCallback = [
      {
        ...body,
        paymentMethod: OrderPaymentMethodEnum.MOMO,
        currentAccount: currentAccount,
        isPaid: true,
        paymentCode: requestId,
      },
    ];
    const extraData = Buffer.from(JSON.stringify(dataCallback)).toString(
      'base64'
    );
    const autoCapture = true;

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    // console.log('--------------------RAW SIGNATURE----------------');
    // console.log(rawSignature);
    // console.log('--------------------RAW SIGNATURE----------------');
    // //puts raw signature
    // console.log('--------------------RAW SIGNATURE----------------');

    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString();
    // console.log('--------------------SIGNATURE----------------');
    // console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      signature: signature,
    });
    // console.log(requestBody);
    // console.log(process.env.MOMO_ENDPOINT_CREATE);

    // options for axios
    const options = {
      method: 'POST',
      url: process.env.MOMO_ENDPOINT_CREATE,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    // Send the request and handle the response
    let result: { data: any };
    try {
      result = await axios(options);
      // result = await axios.post(process.env.MOMO_ENDPOINT_CREATE, null, {
      //   params: requestBody,
      // });
      return { ...result.data };
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      console.error('MoMo Payment Error Response:', error?.response?.data);
      console.log(message);

      throw new HttpException(
        `MoMo payment failed: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async callback(req: any) {
    const response = req.body;
    console.log(req.body);

    console.log('--------------------PAYMENT CALLBACK----------------');
    console.log(response); // In ra phản hồi từ MoMo

    // Kiểm tra trạng thái thanh toán
    // if (response && response.resultCode === 0) {

    if (response) {
      // Thanh toán thành công
      // console.log('Payment Successful:', response);
      // Bạn có thể lưu thông tin thanh toán vào cơ sở dữ liệu hoặc xử lý tiếp theo tại đây

      const extraData = response.extraData
        ? JSON.parse(Buffer.from(response.extraData, 'base64').toString())
        : null;
      // console.log('Extra Data:', extraData);

      const appReq: AppointmentRequest = extraData[0];

      const currentAccount = extraData[0].currentAccount;

      await this.appService.createAppointment(currentAccount, appReq);

      // console.log(newApp);
    } else {
      console.log('Payment Failed:', response);
    }

    return response;
  }

  async checkStatusTrans(orderId: string) {
    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
    });
    const options = {
      method: 'POST',
      url: process.env.MOMO_ENDPOINT_QUERY,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };
    let result: { data: any };
    try {
      result = await axios(options);
      return { ...result.data };
    } catch (error: any) {
      throw new Error(`Payment failed: ${error.message}`);
    }
  }
}

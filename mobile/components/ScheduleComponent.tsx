import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';
import { TruncateText } from '@/utils/string.utils';

const { height: screenHeight } = Dimensions.get('window');

const isPaid = (isPaid: boolean) => {
  return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
}

export default function ScheduleComponent(props: any) {


  const {data} = props;

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.mark}></View>
      <View style={styles.bodyContainer}>
        <Text style={styles.specialization}>{data.specialization.name}</Text>
        <Text style={styles.number}>{data.appointment.number}</Text>
        <View style={data.appointment.isPaid ? [styles.paidContainer, {backgroundColor: Colors.success.background}] : [styles.paidContainer, {backgroundColor: Colors.danger.background}]}>
          <Text style={styles.paidText}>{isPaid(data.appointment.isPaid)}</Text>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.bodyItemContainer}>
          <Text style={styles.bodyItemTitle}>Thời gian : </Text>
          <Text style={styles.bodyItemData}>{data.time}</Text>
        </View>
        <View style={styles.bodyItemContainer}>
          <Text style={styles.bodyItemTitle}>Bác sĩ : </Text>
          <Text style={styles.bodyItemData}>{TruncateText(data.doctor.name, 15)}</Text>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.bodyItemContainer}>
          <Text style={styles.bodyItemTitle}>Ngày khám : </Text>
          <Text style={styles.bodyItemData}>{data.appointment.appointment_date}</Text>
        </View>
        <View style={styles.bodyItemContainer}>
          <Text style={styles.bodyItemTitle}>Phòng : </Text>
          <Text style={styles.bodyItemData}>{TruncateText(data.doctor.room, 15)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    paddingLeft: 15,
    borderRadius : 10,
    overflow : "hidden",
    backgroundColor : Colors.light.main,
    paddingVertical : 10,
  },
  mark : {
    backgroundColor : Colors.primary.main,
    width : 10,
    height : screenHeight + 20,
    position : "absolute",
    left : 0,
    top : 0,
  },
  bodyContainer : {
    display : "flex",
    flexDirection : "row",
    justifyContent : "space-between",
    paddingHorizontal : 10,
    paddingVertical : 5,
    alignItems : "center",
    marginVertical : 3,
  },
  specialization : {
    color : Colors.primary.main,
    fontSize : 15,
    fontWeight : "bold",
  },
  number : {
    color : Colors.primary.main,
    fontSize : 20,
    fontWeight : "bold",
  },
  paidContainer : {
    paddingVertical : 5,
    paddingHorizontal : 10,
    borderRadius : 5,
  },
  paidText : {
    color : Colors.light.main,
    fontSize : 12,
    fontWeight : "bold",
  },
  bodyItemContainer : {
    display : "flex",
    flexDirection : "row",
    justifyContent : "space-between",
    paddingVertical : 5,
    alignItems : "center",
  },
  bodyItemTitle : {
    color : Colors.primary.main,
    fontSize : 11,
    fontWeight : "bold",
  },
  bodyItemData : {
    fontSize : 11,
  },
})
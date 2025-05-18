import { toast } from "react-toastify";

const callAPIForm = async (method, errorMessage) => {
  try {
    await method();
  } catch (error) {
    console.log(error);
    toast.error(
      error?.response?.data?.message[0]?.message ||
        errorMessage ||
        "Có lỗi xảy ra, vui lòng thử lại sau."
    );
  }
};

export default callAPIForm;

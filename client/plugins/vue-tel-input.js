import { defineNuxtPlugin } from "#app";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";



export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTelInput,{
    mode: "international",  // Hiển thị theo định dạng quốc tế
    onlyCountries: ["VN", "US", "JP", "FR", "DE"],  // Chỉ cho phép chọn Việt Nam và Mỹ
    defaultCountry: "VN",  // Quốc gia mặc định là Việt Nam
    showDialCode: true,  // Hiển thị mã vùng (+84)
    autoFormat: true,  // Tự động định dạng số điện thoại
    validCharactersOnly: true,  // Chỉ cho phép nhập số hợp lệ
  });
});

import { defineNuxtPlugin } from "#app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUser,
  faHome,
  faShoppingCart,
  faExclamationCircle,
  faSearch,
  faBars,
  faRightFromBracket,
  faCog,
  faTimesCircle,
  faPhone,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart,} from "@fortawesome/free-regular-svg-icons";
import {
  
  faFacebook,
  faTwitter,
  faInstagram,
  faGoogle,
 
} from "@fortawesome/free-brands-svg-icons";

library.add(

  faPhone,
  faInfo,
  faTimesCircle,
  faSearch,
  faUser,
  faHome,
  faShoppingCart,
  faHeart,
  faFacebook,
  faTwitter,
  faInstagram,
  faGoogle,
  faExclamationCircle,
  faBars,faRightFromBracket,
  faCog,
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});

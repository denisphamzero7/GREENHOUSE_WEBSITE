import { defineStore } from 'pinia';
export const useModalStore = defineStore('modal-store',{
state:()=>({
    isOpen: false,
    title: '',
    content: '',
    confirmButtonText: '',
    cancelButtonText: '',
    confirmButtonColor: '',
    cancelButtonColor: '',
    confirmButtonIcon: '',
    cancelButtonIcon: '',
    onConfirm: null,
    onCancel: null,
}),
getters:{
    
},
actions:{
  

}
});
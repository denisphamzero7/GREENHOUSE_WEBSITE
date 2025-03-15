import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isMenuOpen: false,
    selectIndex: null,
    menuItems:[
     { title: 'Overview', icon: 'home', path: '/' },
      { title: 'About', icon: 'info', path: '/about' },
      { title: 'Contact', icon: 'phone', path: '/contact' },
      { title: 'Services', icon: 'handshelping', path: '/services' },
      { title: 'Products', icon: 'product', path: '/products' },
      { title: 'FAQ', icon: 'faq', path: '/faq' },
      { title: 'Blog', icon: 'blog', path: '/blog' },
      { title: 'Support', icon: 'support', path: '/support' },
      { title: 'Account', icon: 'account', path: '/account' },
      { title: 'Settings', icon: 'settings', path: '/settings' },
      { title: 'Log Out', icon: 'logout', path: '/logout' },
    
    ]
  }),
  getters: {
   selectedItem:(state) => typeof state.selectIndex === 'number'
   ? state.menuItems[state.selectIndex]:null,
    menuOpen: (state) => state.isMenuOpen,
    items:(state) => state.menuItems, 
  },
  actions: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    openMenu() {
      this.isMenuOpen = true;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    selectMenuItem(index: null) {
        this.selectIndex = index;
    }
  },
  
});

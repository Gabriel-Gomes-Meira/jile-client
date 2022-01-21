import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
// import pt from 'vuetify/lib/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    dark:true,
    themes: {
      light: {

      },
      dark: {
        l1: '#000842',
        l2: '#003373',
        l3: '#005E9A',
        l4: '#008AB3',
        l5: '#00B6BC',
        l6: '#00E1B9', 
        backcard:'#323232',
        'video':'#e76f51',
        'audio':'#e9c46a',
        'image':'#00b4d8',
        'text':'#2a9d8f'
      }
    },
  },
    // lang: {
    //   locales: { pt },
    //   current: 'pt',
    // },
});

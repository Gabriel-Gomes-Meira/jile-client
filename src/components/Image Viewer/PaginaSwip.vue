
<template>
  <swiper class="swiper" :options="swiperOption" >
    <swiper-slide v-for="(img, index) in Images" :key="index"
    :ref="'ss_'+index">
        <img :src="img.src" @click="setIndex(index)">
    </swiper-slide>    
    
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
    name: 'PaginaSwip',

    props:['Images'],

    components: {
      	Swiper,
		SwiperSlide
    },

    data() {
      	return {
			swiperOption: {
				slidesPerView: 3,
				spaceBetween: 30,
				//freeMode: true, 
				grabCursor: true,         
				loop: true,
				centeredSlides: true,
			},    
      	}
    },    

	updated(){
		if(this.Images.length<=3) {
			this.swiperOption.loop = false;
			return false;
		} else {
			this.swiperOption.loop = true;
			return true;
		}
	},

	created() {
		if(this.Images.length<=3) {
			this.swiperOption.loop = false;
			return false;
		} else {
			this.swiperOption.loop = true;
			return true;
		}
	},

    methods:{

		setIndex(index){			
			for (let i = 0; i < this.Images.length; i++) {
				this.$refs['ss_'+i][0].$el.classList.remove('swiper-slide-choosed')                
			}
			this.$refs['ss_'+index][0].$el.classList.add('swiper-slide-choosed')
			this.$emit('choosedImage', index)            
		}
    }    
}
</script>

<style scoped>
    .swiper-container{
        height: 100%;
        padding-bottom: 2.5%;
        padding-top: 2.5%;
    }
    .swiper-slide{        
        height: 95%;        
    }
    
    .swiper-slide-choosed {
         transform: scale(1.1);
        border: solid rgba(255, 255, 255, 0.818) 3px!important; 
    }
    .swiper-slide:hover{
        transform: scale(1.1);
        border: solid rgba(255, 255, 255, 0.338) 3px;        
    }
    .swiper-slide img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(50%);
        cursor: pointer;
    }    

    .swiper-slide-choosed img {
      	filter: brightness(100%);
    }
  
</style>
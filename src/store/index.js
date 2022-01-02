import Vue from 'vue'
import Vuex from 'vuex'
import Handler from './Handler'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		Handler,
		defaultSizes:{
			Player:{
				w:50,
				h:30
			},        
			Image:{
				w:40,
				h:54
			},
			Text:{
				w:30,
				h:32
			},		
		},
		availbleThemes:{
			darkblue:{
				l1: '#000842',
				l2: '#003373',
				l3: '#005E9A',
				l4: '#008AB3',
				l5: '#00B6BC',
				l6: '#00E1B9',  
				i1: '#ABD1FF',
			},
			vinne:{
				l1: '#4C082D',
				l2: '#690B3D',
				l3: '#880E4F',
				l4: '#B51369',
				l5: '#E92C91',
				l6: '#F073B6',
				i1: '#F7B3D7'
			},
			darkgreen:{
				l1: '#23462C',
				l2: '#30603C',
				l3: '#3D794C',
				l4: '#4D9960',
				l5: '#73B985',
				l6: '#A2D0AE',
				i1: '#CBE5D1',
			},
			gray:{
				l1: '#2B3A41',
				l2: '#3B4F5A',
				l3: '#4A6471',
				l4: '#5D7E8E',
				l5: '#829FAD',
				l6: '#ACBFC9',
				i1: "#D0DBE0",
			},
			darkyellow:{
				l1: '#493D00',
				l2: '#6D5B00',
				l3: '#927900',
				l4: '#FFDB24',
				l5: '#FFE45B',
				l6: '#FFED92',
				i1: '#FFF1A9',
			},
			darkambar:{
				l1: '#723100',
				l2: '#9C4400',
				l3: '#C85700',
				l4: '#F36900',
				l5: '#FF8E37',
				l6: '#FFB37A',
				i1: '#FFD4B4'
			},
			darkred:{
				l1: '#510D0D',
				l2: '#6F1111',
				l3: '#8E1616',
				l4: '#B81D1D',
				l5: '#E13E3E',
				l6: '#EB7E7E',
				i1: '#F4B8B8'
			},			
		},   
		AppState:{
			serverConnected:"",	
			currenttheme:'darkblue'		
		}
	},

  	mutations: {

		recoverWorkSpaces(){            
			var savedworkstate = JSON.parse(localStorage.getItem('workspaces'));    

			if(savedworkstate) {                  
				Handler.wks = savedworkstate;  
			}                  
		},

		// recoverTheme(){
		// 	var storagedTheme = JSON.parse(localStorage.getItem('currenttheme'))

		// 	if(storagedTheme) {
		// 		this.state.availbleThemes.current = storagedTheme;
		// 	}          
		// },

		recoverAppState(state){

			for (const key in state.AppState) {
				var item = localStorage.getItem(`jc_${key}`)
				if(item) {
					state.AppState[key] = item
				}
			}
		},
		
		saveWorkSpaces(state){      
			localStorage.setItem('workspaces', JSON.stringify(state.Handler.wks))
			// localStorage.setItem('currenttheme', JSON.stringify(state.availbleThemes.current))
		},
		
		alterTheme(state, name){
			state.availbleThemes.current = name;
		},
		
		setAppState(state, data){
			state.AppState[data[0]] = data[1]
			localStorage.setItem(`jc_${data[0]}`, data[1])
		}				
  	},

  	actions: {
		loadState({ commit }) {
			commit('recoverAppState')       
			// commit('recoverTheme')    
			commit('recoverWorkSpaces')
		},
		
		saveWorkState({ commit }) {
			commit('saveWorkSpaces')	
			return 'Estado dos Workspaces salvos!'		
		},
		
		// changeTheme({ commit }, name) {
		// 	commit('alterTheme', name)
		// 	return 'Tema alterado para '+name;
		// },

		saveAppState({ commit }, data){
			commit('setAppState', data)
		}
	},

	

  	getters: {
		WKs: state => state.Handler,
		defaultSizes: state => state.defaultSizes,
		theme: state => state.availbleThemes[state.AppState.currenttheme],		
		server: state => state.AppState.serverConnected.length>0?state.AppState.serverConnected:false
	}
})

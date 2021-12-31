import Vue from 'vue'
import Vuex from 'vuex'
import Handler from './Handler'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		Handler,
		// contentsPresets:{},		
		// MarkdowerTexts:[],
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
					
			},
			vinne:{
				l1: '#4C082D',
				l2: '#690B3D',
				l3: '#880E4F',
				l4: '#B51369',
				l5: '#E92C91',
				l6: '#F073B6',
			},
			darkgreen:{
				l1: '#23462C',
				l2: '#30603C',
				l3: '#3D794C',
				l4: '#4D9960',
				l5: '#73B985',
				l6: '#A2D0AE',
			},
			gray:{
				l1: '#2B3A41',
				l2: '#3B4F5A',
				l3: '#4A6471',
				l4: '#5D7E8E',
				l5: '#829FAD',
				l6: '#ACBFC9',
			},
			darkyellow:{
				l1: '#493D00',
				l2: '#6D5B00',
				l3: '#927900',
				l4: '#FFDB24',
				l5: '#FFE45B',
				l6: '#FFED92',
			},
			darkambar:{
				l1: '#723100',
				l2: '#9C4400',
				l3: '#C85700',
				l4: '#F36900',
				l5: '#FF8E37',
				l6: '#FFB37A',
			},
			darkred:{
				l1: '#510D0D',
				l2: '#6F1111',
				l3: '#8E1616',
				l4: '#B81D1D',
				l5: '#E13E3E',
				l6: '#EB7E7E',
			},
			current:'darkblue'
		},
		serverConnected:""
	},

  	mutations: {

		initWorkSpaces(){            
			var savedworkstate = JSON.parse(localStorage.getItem('workspaces'));    

			if(savedworkstate) {                  
				Handler.wks = savedworkstate;  
			}                  
		},

		recoverTheme(){
			var storagedTheme = JSON.parse(localStorage.getItem('currenttheme'))

			if(storagedTheme) {
				this.state.availbleThemes.current = storagedTheme;
			}          
		},

		// getContent(){
		// 	var presets = JSON.parse(localStorage.getItem('contentspresets'))

		// 	if(presets) {
		// 		this.state.contentsPresets = presets
		// 	}
		// },

		saveWorkSpaces(state){      
			localStorage.setItem('workspaces', JSON.stringify(state.Handler.wks))
			localStorage.setItem('currenttheme', JSON.stringify(state.availbleThemes.current))
		},

		alterTheme(state, name){
			state.availbleThemes.current = name;
		},

		// setContent(state){
		// 	localStorage.setItem('contentspresets', JSON.stringify(state.contentsPresets))           
		// },   

		// deleteContent(state, cellid){      
		// 	delete state.contentsPresets[cellid]      
		// },

		saveTexts(state){
			// 'use strict';
			// const fs = require('fs');									
			// fs.writeFileSync('MarkdowerTexts.json', JSON.stringify(state.MarkdowerTexts));
		},
		loadTexts(state){
			// 'use strict';
			// const fs = require('fs');
			// try {
			// 	let rawdata = fs.readFileSync('MarkdowerTexts.json');
			// 	state.MarkdowerTexts = JSON.parse(rawdata);							
			// } catch (error) {
			// 	console.log(error);
			// }
		}
  	},

  	actions: {
		loadState({ commit }) {
			commit('initWorkSpaces')
			commit('recoverTheme')    
			// commit('getContent')        
		},
		
		saveState({ commit }) {
			commit('saveWorkSpaces')
			return 'Salvo com sucesso!';
		},

		// saveContent({ commit }) {
		// 	commit('setContent');
		// },

		saveMarkdower({ commit }) {
			commit('saveTexts')
		},
		loadMarkdower({ commit }) {
			commit('loadTexts')
		},

		// deleteContent({ commit }, cell) {
		// 	if(this.state.contentsPresets[cell.id]) {
		// 		commit('deleteContent', cell.id)
		// 		commit('setContent')
		// 	}
		// },

		changeTheme({ commit }, name) {
			commit('alterTheme', name)
			return 'Tema alterado para '+name;
		},
	},

	modules: {
	},

  	getters: {
		WKs: state => state.Handler,
		defaultSizes: state => state.defaultSizes,
		theme: state => state.availbleThemes[state.availbleThemes.current],
		// contentsPresets: state => state.contentsPresets,
		// Texts: state=>state.MarkdowerTexts,
		server: state => state.serverConnected.length>0?`${state.serverConnected}:3000`:false
	}
})

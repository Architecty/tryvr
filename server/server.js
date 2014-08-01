if(Meteor.isServer){
	Meteor.startup(function(){
		console.log("Startup functions ready");		
		
		Meteor.methods({
			insertDemo: function(meetupType, location, contact, HMDS, controllers, bribes, note){
				return insertDemo(meetupType, location, contact, HMDS, controllers, bribes, note);
			},
			returnMarkers: function(){
				return returnMarkers();
			},
			retireListing: function(demoID, reason){
				retireListing(demoID, reason);
			},
			addExistingData: function(){
				return addExistingData();
			}
		});
		
		function insertDemo(meetupType, location, contact, HMDS, controllers, bribes, note){
			var geocode = [];
			
			if(location === ""){
				return "location";
			}
			if(location !== null) geocode = getGeocode(location)[0];
			
			console.log(geocode.city);
			if(geocode.city === null){
				return "geocode";
			}
			
			//Check to make sure that at least one of the contacts has something in it
			var totalContacts = "";
			for(var key in contact){
				if(contact.hasOwnProperty(key)){
					totalContacts += contact[key];
				}
			}
			if(totalContacts.length < 4){
				return "contacts";
			}
			
			//Check to make sure at least one HMD is marked
			if(HMDS.length < 1){
				return "hmds";
			}
			
			Demos.insert({
				userType: meetupType,
				contactMethods:contact,
				location: location,
				loc:{
					lon: geocode.longitude, 
					lat: geocode.latitude
					},
				geocode: geocode,
				headsets: HMDS,
				peripherals: controllers,
				bribes: bribes,
				note: note
			});
			console.log("Added record for ", location);
			return "(" + geocode.latitude + ", " + geocode.longitude + ")";
		}
		
		function getGeocode(addressString){
			
			var geo = new GeoCoder(addressString);
			var result = geo.geocode(addressString);
			if(result != null){
				console.log("Geocode of " + addressString + " is " + result);
			}
			else{
				console.log("error?");
			}
			return result;
		}
		
		//Use this to get a simplified set of markers, accounting for markers that are in the same city
		function returnMarkers(){
	
			var demoPoints = Demos.find({retiredStatus:{$ne: "retired"}}).fetch();
			
			var uniqueLatLng = [];
			var allPoints = [];
			
			for(var i = 0; i < demoPoints.length; i++){
				var latlng = demoPoints[i].geocode.latitude + "," + demoPoints[i].geocode.longitude;
				if(uniqueLatLng.indexOf(latlng) == -1){
					uniqueLatLng.push(latlng);
					
					var tempObject = {
						_id: demoPoints[i]._id,
						lat: demoPoints[i].geocode.latitude,
						long: demoPoints[i].geocode.longitude, 
						icon: "", 
						title: demoPoints[i].geocode.city + ", " + demoPoints[i].geocode.stateCode + ", " + demoPoints[i].geocode.countryCode
					};
					switch(demoPoints[i].userType){
						case "individual": 
							tempObject.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
							break;
						case "group": 
							tempObject.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
							break;
						default:
							tempObject.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
					}
					allPoints.push(tempObject);
				}
			}
			return allPoints;
		}
		
		function addFluffData(){
			
			var fluffdata = ["TOKYO, Japan", "JAKARTA, Indonesia", "New York (NY), United States", "SEOUL, South Korea", "MANILA, Philippines", "Mumbai (Bombay), India", "Sao Paulo, Brazil", "MEXICO CITY, Mexico", "Delhi, India", "Osaka, Japan", "CAIRO, Egypt", "Kolkata (Calcutta), India", "Los Angeles (CA), United States", "Shanghai, China", "MOSCOW, Russia", "BEIJING (PEKING), China", "BUENOS AIRES, Argentina", "Guangzhou, China", "Shenzhen, China", "Istanbul, Turkey", "Rio de Janeiro, Brazil", "PARIS, France", "Karachi, Pakistan", "Nagoya, Japan", "Chicago (IL), United States", "Lagos, Nigeria", "LONDON, United Kingdom", "BANGKOK, Thailand", "KINSHASA, Dem Rep of Congo", "TEHRAN, Iran", "LIMA, Peru", "Dongguan, China", "BOGOTA, Colombia", "Chennai (Madras), India", "DHAKA, Bangladesh", "Essen, Germany", "Tianjin (Tientsin), China", "HONG KONG, China - Hong Kong", "Taipei, Taiwan (China ROC)", "Lahore, Pakistan", "Ho Chi Minh City (Saigon), Viet Nam", "Bangalore, India", "Hyderabad, India", "Johannesburg, South Africa", "BAGHDAD, Iraq", "Toronto, Canada", "SANTIAGO, Chile", "KUALA LUMPUR, Malaysia", "San Francisco (CA), United States", "Philadelphia (PA), United States", "Wuhan, China", "Miami (FL), United States", "Dallas (TX), United States", "MADRID, Spain", "Ahmedabad, India", "Boston (MA), United States", "Belo Horizonte, Brazil", "KHARTOUM, Sudan", "Saint Petersburg (Leningrad), Russia", "Shenyang, China", "Houston (TX), United States", "Pune, India", "RIYADH, Saudi Arabia", "SINGAPORE, Singapore", "WASHINGTON (DC), United States", "Yangon , Myanmar", "Milan (Milano), Italy", "Atlanta (GA), United States", "Chongqing, China", "Alexandria, Egypt", "Nanjing (Nanking) , China", "Guadalajara, Mexico", "Barcelona, Spain", "Chengdu, China", "Detroit (MI), United States", "ANKARA, Turkey", "Abidjan, Côte d'Ivoire", "ATHENS, Greece", "BERLIN, Germany", "Sydney, Australia", "Monterrey, Mexico", "Phoenix (AZ), United States", "Busan (Pusan), South Korea", "Recife, Brazil", "Bandung, Indonesia", "Porto Alegre, Brazil", "Melbourne, Australia", "LUANDA, Angola", "Hangzhou (Hangchow) , China", "ALGIERS, Algeria", "Hà Noi (HANOI), Viet Nam", "Montréal, Canada", "Xi'an (Sian) , China", "PYONGYANG, North Korea", "Qingdao (Tsingtao) , China", "Surat, India", "Fortaleza, Brazil", "Medellín, Colombia", "Durban, South Africa", "Kanpur, India", "ADDIS ABABA, Ethiopia", "NAIROBI, Kenya", "Jeddah (Jiddah), Saudi Arabia", "Naples (Napoli), Italy", "KABUL, Afghanistan", "Salvador, Brazil", "Harbin (Haerbin), China", "Kano, Nigeria", "Casablanca (Dar-el-Beida), Morocco", "CAPE TOWN, South Africa", "Curitiba, Brazil", "Surabaya, Indonesia", "San Diego (CA), United States", "Seattle (WA), United States", "ROME, Italy", "Dar es Salaam, Tanzania", "Taichung, China", "Jaipur, India", "CARACAS, Venezuela", "DAKAR, Senegal", "Kaohsiung, China", "Minneapolis (MN), United States", "Lucknow, India", "AMMAN, Jordan", "Tel Aviv-Yafo, Israel", "Guayaquil, Ecuador", "KYIV (KIEV), Ukraine", "Faisalabad (Lyallpur), Pakistan", "Mashhad, Iran", "Izmir, Turkey", "Rawalpindi, Pakistan", "TASHKENT, Uzbekistan", "Katowice, Poland", "Changchun, China", "Campinas, Brazil", "Daegu (Taegu), South Korea", "Changsha, China", "Nagpur, India", "San Juan, Philippines", "Aleppo, Syria", "LISBON, Portugal", "Frankfurt am Main, Germany", "Nanchang, China", "Birmingham[] , United Kingdom", "Tampa (FL), United States", "Medan, Indonesia", "Dalian, China", "TUNIS, Tunisia", "Shijiazhuang, China", "Manchester, United Kingdom", "PORT-AU-PRINCE, Haiti", "DAMASCUS, Syria", "Ji'nan, China", "Fukuoka, Japan", "SANTO DOMINGO, Dominican Republic", "HAVANA, Cuba", "Cali, Colombia", "Denver (CO), United States", "St. Louis (MO), United States", "Colombo, Brazil", "Dubai, United Arab Emirates", "Baltimore (MD), United States", "Sapporo, Japan", "Rotterdam, Netherlands", "Vancouver, Canada", "Preston, United Kingdom", "Patna, India", "SANA'A, Yemen", "WARSAW, Poland", "Bonn, Germany", "ACCRA, Ghana", "BUCHAREST, Romania", "Yokohama, Japan", "Kunming, China", "Guiyang, China", "Zibo, China", "Incheon, South Korea", "Zhengzhou, China", "Taiyuan, China", "Chaoyang (Guangdong), China", "BRASILIA, Brazil", "Zhongshan, China", "West Midlands, United Kingdom", "Giza, Egypt", "Quezon City, Philippines", "Nanhai, China", "Fuzhou (Fujian), China", "Lanzhou, China", "Xiamen, China", "Chittagong, Bangladesh", "Zaozhuang, China", "Jilin, China", "Linyi, China", "Wenzhou, China", "STOCKHOLM, Sweden", "Puebla de Zaragoza, Mexico", "Puning, China", "BAKU, Azerbaijan", "Ibadan, Nigeria", "Brisbane, Australia", "MINSK, Belarus", "Sikasso, Mali", "Nanchong, China", "Nanning, China", "Urumqi, China", "Yantai, China", "Fuyang (Zhejiang), China", "Tangshan, China", "Maracaibo, Venezuela", "Hamburg, Germany", "BUDAPEST, Hungary", "Shunde, China", "Manaus, Brazil", "Xuzhou, China", "Ségou, Mali", "Baotou, China", "Hefei, China", "VIENNA, Austria", "Indore, India", "ASUNCION, Paraguay", "Tianmen, China", "BELGRADE, Serbia", "Suzhou (Anhui), China", "Suizhou, China", "Nanyang, China", "Nakuru, Kenya", "Koulikoro, Mali", "Ningbo, China", "Liuan, China", "Anshan, China", "Tengzhou, China", "Qiqihaer, China", "Pizhou, China", "Taian, China", "Datong, China", "Kobe, Japan", "Hama, Syria", "Esfahan, Iran", "TRIPOLI, Libya", "West Yorkshire, United Kingdom", "Vadodara, India", "Taizhou (Zhejiang), China", "Luoyang, China", "QUITO, Ecuador", "Jinjiang, China", "Mopti, Mali", "Perth, Australia", "Daejeon (Taejon), South Korea", "Kyoto, Japan", "Xiantao, China", "Tangerang, Indonesia", "Bhopal, India", "Coimbatore, India", "Kharkiv, Ukraine", "Gwangju (Kwangchu), South Korea", "Xinghua, China", "HARARE, Zimbabwe", "Fushun, China", "Shangqiu, China", "Belém, Brazil", "Wuxi, China", "Hechuan, China", "Wujin, China", "Guigang, China", "Jianyang (Sichuan), China", "Huhehaote, China", "Santa Cruz, Bolivia", "Semarang, Indonesia", "Ludhiana, India", "Novosibirsk, Russia", "Neijiang, China", "MAPUTO, Mozambique", "Nan'an, China", "Douala, Cameroon", "Weifang, China", "Daqing, China", "Kayes, Mali", "Tongzhou, China", "Tabriz, Iran", "Homs, Syria", "Rugao, China", "Guiping, China", "Huainan, China", "Kochi, India", "Suining, China", "Bozhou, China", "Zhanjiang, China", "Changde, China", "MONTEVIDEO, Uruguay", "Suzhou (Jiangsu), China", "Xintai, China", "Ekaterinoburg, Russia", "Juárez, Mexico", "Handan, China", "Visakhapatnam, India", "Kawasaki, Japan", "Jiangjin, China", "Pingdu, China", "Agra, India", "Jiangyin, China", "Tijuana, Mexico", "Liuyang, China", "Bursa, Turkey", "Al-Hasakeh, Syria", "Makkah, Saudi Arabia", "YAOUNDE, Cameroon", "Xuanwei, China", "Dengzhou, China", "Palembang, Indonesia", "Nizhny Novgorod, Russia", "León (de los Aldama), Mexico", "Guarulhos, Brazil", "Heze, China", "Auckland, New Zealand", "Omdurman, Sudan", "Shantou, China", "Leizhou, China", "Yongcheng, China", "Valencia, Venezuela", "Thane, India", "San Antonio (TX), United States", "Xinyang, China", "Luzhou, China", "Almaty, Kazakhstan", "Changshu, China", "Taixing, China", "PHNOM PENH, Cambodia", "Laiwu, China", "Xiaoshan, China", "Yiyang, China", "Goiânia, Brazil", "Liuzhou, China", "Gaozhou, China", "Fengcheng (Jiangxi), China", "Cixi, China", "Karaj, Iran", "MOGADISHU, Somalia", "Varanasi, India", "Córdoba, Argentina", "KAMPALA, Uganda", "Ruian, China", "Lianjiang, China", "Huaian, China", "Shiraz, Iran", "Multan, Pakistan", "Madurai, India", "München, Germany", "Kalyan, India", "Quanzhou, China", "Adana, Turkey", "Bazhong, China", "Fès, Morocco", "OUAGADOUGOU, Burkina Faso", "Haicheng, China", "Xishan, China", "Leiyang, China", "Caloocan, Philippines", "Kalookan (Caloocan), Philippines", "Jingzhou, China", "Saitama, Japan", "PRAGUE, Czech Republic", "Fuqing, China", "Kumasi, Ghana", "Meerut, India", "Hyderabad, Pakistan", "Lufeng, China", "Dongtai, China", "Yixing, China", "Mianyang, China", "Wenling, China", "Leqing, China", "OTTAWA, Canada", "Yushu, China", "Barranquilla, Colombia", "Hiroshima, Japan", "Chifeng, China", "Nashik, India", "Makasar (Ujung Pandang), Indonesia", "SOFIA, Bulgaria", "Rizhao, China", "Davao, Philippines", "Tianshui, China", "Huzhou, China", "Samara (Samarskaya oblast), Russia", "Omsk, Russia", "Gujranwala, Pakistan", "Adelaide, Australia", "Macheng, China", "Wuxian, China", "Bijie, China", "Yuzhou, China", "Leshan, China", "La Matanza, Argentina", "Rosario, Argentina", "Jabalpur, India", "Kazan, Russia", "Jimo, China", "Dingzhou, China", "Calgary, Canada", "YEREVAN, Armenia", "El-Jadida, Morocco", "Jamshedpur, India", "Zürich, Switzerland", "Zoucheng, China", "Pikine-Guediawaye, Senegal", "Anqiu, China", "Guang'an, China", "Chelyabinsk, Russia", "CONAKRY, Guinea", "Asansol, India", "Shouguang, China", "Changzhou, China", "Ulsan, South Korea", "Zhuji, China", "Toluca (de Lerdo), Mexico", "Marrakech, Morocco", "Dhanbad, India", "TBILISI, Georgia", "Hanchuan, China", "LUSAKA, Zambia", "Qidong, China", "Faridabad, India", "Zaoyang, China", "Zhucheng, China", "Rostov-na-Donu, Russia", "Jiangdu, China", "Xiangcheng, China", "Zigong, China", "Jining (Shandong), China", "Edmonton, Canada", "Allahabad, India", "Beiliu, China", "Dnipropetrovsk, Ukraine", "Gongzhuling, China", "Qinzhou, China", "Ufa, Russia", "Sendai, Japan", "Volgograd, Russia", "Ezhou, China", "GUATEMALA CITY, Guatemala", "Zhongxiang, China", "AMSTERDAM, Netherlands", "BRUSSELS, Belgium", "BAMAKO, Mali", "Ziyang, China", "ANTANANARIVO, Madagascar", "Mudanjiang, China", "Amritsar, India", "Vijayawada, India", "Haora (Howrah), India", "Donetsk (Donestskaya oblast), Ukraine", "Huazhou, China", "Fuzhou (Jiangxi), China", "Pimpri Chinchwad, India", "DUBLIN, Ireland", "Rajkot, India", "Sao Luís, Brazil", "Béni-Mellal, Morocco", "Lianyuan, China", "Liupanshui, China", "Kaduna, Nigeria", "Kitakyushu, Japan", "Qianjiang, China", "Perm, Russia", "Odessa, Ukraine", "Qom, Iran", "Yongchuan, China", "Peshawar, Pakistan", "Linzhou, China", "Benxi, China", "ULAANBAATAR, Mongolia", "Zhangqiu, China", "Yongzhou, China", "Sao Gonçalo, Brazil", "Srinagar, India", "Ghaziabad, India", "Xinyi (Jiangsu), China", "Köln, Germany", "Zhangjiagang, China", "Wafangdian, China", "Xianyang, China", "Liaocheng, China", "Ahwaz, Iran", "Taishan, China", "Linhai, China", "Feicheng, China", "Suwon (Puwan), South Korea", "Wuwei, China", "Haimen, China", "San Luis Potosí, Mexico", "Liling, China", "Xinhui, China", "Gaziantep, Turkey", "Krasnoyarsk, Russia", "Chiba, Japan", "Voronezh, Russia", "Durg-Bhilai Nagar, India", "Ruzhou, China", "Maceió, Brazil", "Yichun (Jiangxi), China", "Al-Madinah, Saudi Arabia", "Yulin (Guangxi), China", "Seongnam, South Korea", "Yueyang, China", "Yiwu, China", "San Jose (CA), United States", "Jixi, China", "MANAGUA, Nicaragua", "Xinyi (Guangdong), China", "Safi, Morocco", "Guangyuan, China", "Soweto, South Africa", "Zhangjiakou, China", "Baoding, China", "Cartagena, Colombia", "Huludao, China", "Pingdingshan, China", "Torino, Italy", "Zengcheng, China", "Laiyang, China", "Qingzhou, China", "Aurangabad, India", "Lattakia, Syria", "Mérida, Mexico", "Laizhou, China", "Thiruvananthapuram, India", "Weinan, China", "Wuchang, China", "Guangshui, China", "Gaizhou, China", "Göteborg, Sweden", "Xiaogan, China", "Torreón, Mexico", "Jiaxing, China", "Kozhikode, India", "Salé, Morocco", "Zhuzhou, China", "Tyneside, United Kingdom", "Hengyang, China", "Dehui, China", "Honghu, China", "Danyang, China", "Daye, China", "Solapur, India", "Xingning, China", "Xiangfan, China", "Shubra-El-Khema, Egypt", "Luoding, China", "Gwalior, India", "Ranchi, India", "Huiyang, China", "Mombasa, Kenya", "Jinzhou (Liaoning), China", "Jiangyan, China", "Chenghai, China", "Jiamusi, China", "Songzi, China", "TEGUCIGALPA, Honduras", "Wujiang, China", "Jodhpur, India", "Duque de Caxias, Brazil", "Xi'ning, China", "Yuyao, China", "Hezhou, China", "Jiangyou, China", "Tiruchchirappalli, India", "Baoshan, China", "Saratov, Russia", "Nova Iguaçu, Brazil", "Ankang, China", "Gaomi, China", "Yangchun, China", "Santiago de los Caballeros, Dominican Republic", "Danzhou, China", "LA PAZ, Bolivia", "Zhuanghe, China", "Zhuhai, China", "Zhaodong, China", "Sakai, Japan", "Haikou, China", "Jiaonan, China", "El Alto, Bolivia", "Xuancheng, China", "Wuchuan, China", "Yuhang, China", "Qinhuangdao, China", "Bogor, Indonesia", "Kermanshah, Iran", "Longhai, China", "Liverpool, United Kingdom", "Yanshi, China", "Guwahati, India", "Yichun (Heilongjiang), China", "Konya, Turkey", "Barquisimeto, Venezuela", "Yingde, China", "Bengbu, China", "Yibin, China", "Chandigarh, India", "Xiangxiang, China", "Yinchuan, China", "Valencia, Spain", "Guilin, China", "Hamamatsu, Japan", "Sao Bernardo do Campo, Brazil", "Deir El-Zor, Syria", "BISHKEK, Kyrgyzstan", "Teresina, Brazil", "Suihua, China", "BENGHAZI, Libya", "Jiutai, China", "Meishan, China", "Zaporizhya, Ukraine", "Gaoyou, China", "Marseille, France", "Kaifeng, China", "Changning, China", "Tongliao, China", "Natal, Brazil", "Bandar Lampung, Indonesia", "Dongying, China", "Gaoan, China", "Langzhong, China", "Lichuan, China", "Hubli-Dharwad, India", "Mysore, India", "Niigata, Japan", "Indianapolis (IN), United States", "Jiaozhou, China", "Pingxiang (Jiangxi), China", "Haiphong, Viet Nam", "Arequipa, Peru", "Jacksonville (FL), United States", "Tanger, Morocco", "Dandong, China", "KISHINEV, Moldova", "Krasnodar, Russia", "ZAGREB, Croatia", "Xinmi, China", "Chaohu, China", "Xinyu, China", "Gongyi, China", "Huixian, China", "Xinxiang, China", "Port Elizabeth, South Africa", "Mendoza, Argentina", "Nantong, China", "Pengzhou, China", "Khulna, Bangladesh", "Malang, Indonesia", "Padang, Indonesia", "Anyang, China", "Renqiu, China", "Foshan, China", "Anshun, China", "Chihuahua, Mexico", "Campo Grande, Brazil", "Lódz, Poland", "Goyang, South Korea", "Benin City, Nigeria", "Bucheon (Puchon), South Korea", "Gaocheng, China", "Pulandian, China", "Hejian, China", "Dafeng, China", "Kraków, Poland", "Enshi, China", "Dongyang, China", "Lviv, Ukraine", "Kunshan, China", "Shuangcheng, China", "Salem, India", "Jiaozuo, China", "Ad-Dammam, Saudi Arabia", "Huaibei, China", "Liyang, China", "Samut Prakan, Thailand", "Rongcheng, China", "Cenxi, China", "Nampho, North Korea", "Columbus (OH), United States", "Bareilly, India", "Leping, China", "Laixi, China", "Liaoyang, China", "Zhaotong, China", "JERUSALEM, Israel", "Tainan, China", "Cuernavaca, Mexico", "RIGA, Latvia", "Linfen, China", "Québec, Canada", "Lingbao, China", "Shangyu, China", "Wuan, China", "Hailun, China", "Xingyi, China", "Wuxue, China", "Cebu, Philippines", "Aguascalientes, Mexico", "Tolyatti, Russia", "Hamilton, Canada", "Zhoushan, China", "Langfang, China", "Osasco, Brazil", "Nonthaburi, Thailand", "Dashiqiao, China", "Tongxiang, China", "Yichang, China", "Yangzhou, China", "Blantyre City, Malawi", "Hamhung, North Korea", "Jalandhar, India", "Al-Rakka, Syria", "NIAMEY, Niger", "Xiangtan, China", "Winnipeg, Canada", "Oran (Wahran), Algeria", "Kota, India", "Sevilla, Spain", "Navi Mumbai (New Bombay), India", "Port Harcourt, Nigeria", "Saltillo, Mexico", "Khartoum North, Sudan", "Shizuoka, Japan", "Yuanjiang, China", "Raipur, India", "Kryviy Rig, Ukraine", "Yingkou, China", "Wuhu, China", "Zhenjiang, China", "Querétaro, Mexico", "Nankang, China", "Wugang (Hunan), China", "Hegang, China", "Linqing, China", "PRETORIA, South Africa", "Zunyi, China", "Panzhihua, China", "Austin (TX), United States", "Changle, China", "Lianyungang, China", "Yancheng, China", "Zunhua, China", "Changyi, China", "Meknès, Morocco", "Qiongshan, China", "Bulawayo, Zimbabwe", "Wendeng, China", "Okayama, Japan", "Santo André, Brazil", "RABAT, Morocco", "Pakanbaru, Indonesia", "Nehe, China", "Memphis (TN), United States", "Joao Pessoa, Brazil", "KATHMANDU, Nepal", "Longkou, China", "Shengzhou, China", "Antalya, Turkey", "Kumamoto, Japan", "LILONGWE, Malawi", "Mexicali, Mexico", "Kaiping, China", "Palermo, Italy", "Aligarh, India", "Nottingham, United Kingdom", "Haining, China", "Mosul, Iraq", "Hermosillo, Mexico", "Tongcheng, China", "Shulan, China", "Miluo, China", "Bhubaneswar, India", "Yangquan, China", "Chenzhou, China", "Haiyang, China", "Morelia, Mexico", "Huangshi (Hubei), China", "Xinmin, China", "Tétouan, Morocco", "Barnaul, Russia", "Qixia, China", "Jaboatao dos Guarapes, Brazil", "Chongzhou, China", "Cotonou, Benin", "Yingcheng, China", "Zaragoza, Spain", "Changzhi, China", "Qujing, China", "Linghai, China", "Changge, China", "Trujillo, Peru", "Tampico, Mexico", "Maoming, China", "Morón, Argentina", "La Plata, Argentina", "Ciudad Guayana, Venezuela"];
			
			if(Junk.find().count() === 0){
				Junk.insert({count: 0});
			}
			
			var e = Junk.findOne()['count'];
			
			var type = "individual";
			
			for(var i = e; i < e + 8; i++){
				if(i%6 === 0) type = "group";
				
				if(i < fluffdata.length)
				insertDemo(type, fluffdata[i], {reddit: "itinerati"}, ["devKitOne"], [], [], "nothing");
			}
			Junk.update({},{count: e + 8});
			
		}
		
		function addExistingData(){
			
			var spreadsheet = HTTP.call("GET", "http://tryvr2.meteor.com/demo.txt");
			rows = spreadsheet['content'].split("\n");
			
			if(Junk.find().count() === 0){
				Junk.insert({count: 1});
			}
			
			var e = Junk.findOne()['count'];
			
			
			for(var i = e; i < e + 8; i++){
				
					
				if(i < rows.length){
					var cols = rows[i].split("\t");
					
					var contact = {
						reddit: cols[1].trim(),
						mtbs: cols[2].trim(),
						devForum: cols[3].trim(),
						twitter: cols[6].trim(),
						email: cols[5].trim(),
						url: cols[4].trim(),
						otherContact: ""
						};
						
					insertDemo("individual", cols[0].trim(), contact, ["Oculus Rift - DK1"], [], [], cols[7].trim());
					
				}
			}
			Junk.update({},{count: e + 8});
			console.log("ended at " + e);
		}
		
		function retireListing(demoID, reason){
			if(demoID){
				Demos.update({_id: demoID}, {$set: {retiredStatus: "retired", retiredReason: reason}});
				console.log("Retired " + demoID + " because of: " + reason);
			}
		}
	});
			
}

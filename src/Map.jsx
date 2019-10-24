import React from "react";
import { loadModules } from 'esri-loader';
import axios from 'axios';
import { stat } from "fs";




class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    // create map
    loadModules(['esri/Map', 'esri/views/MapView','esri/layers/FeatureLayer',"esri/widgets/LayerList"], { css: true })
    .then(([Map, MapView,FeatureLayer,LayerList]) => {

      const languageTemplate = {
        title: "Top Language Category",
        content: this.languageCheck
      };
      
     
      const usOutline = new FeatureLayer({
        // URL to the service
        url: "https://services6.arcgis.com/hERbCYWNM6zA0Lns/arcgis/rest/services/us_outline/FeatureServer/0?token=hqiXZHYfeGFlhpC_2pO5lkpMP4homAZ2yH-lp2PUdTETAqAjE2x5gZcRkYJYzgw9Xj_r5tLDQpi3B8BVs6sRLygCqT96IR0GT3UMq8Ie8p3bV9opxqG4v7_DzJUYPXWX6sLEQ1tzwL7ee6x5Bvzy2_P0O3CiT_T521BsFAAAobNEK_r5RnfD_IaX1lgJy__XlEMqwF4Zk9sGSKF-EQZy-yAY5xRLcZz_mnxdlMj8tvdcJ7UNx2bYISm41VDQ8Psh"
        ,outFields : ["*"]
      });
      
      usOutline.renderer = this.mapStyle("USA",4)
    
      const county = new FeatureLayer({
        // URL to the service
        url:"https://services6.arcgis.com/hERbCYWNM6zA0Lns/arcgis/rest/services/county/FeatureServer/0?token=cHOgwSl9Z3KlsN1-ouC_0FLLT2f_ni4dZahxmyC9pMbvrUqJhbjgkNxPbTPox7GQL0NHKVmXl7dIwyDBQYLxeHULLOcaUlyh2ZHiJcxs8ee92MLlihUJDCoFaNoOgTfhSKuWvhMgGl7bWiY-5XxITxPsfNM9IfzlVsbShJsA8f69IoYVFyC1g0Z3jvBFylFKI3Ix1qxJmA7RlDGKkMF_1vrut0lQBxXaI3UL7OwZ3XWHn9iav-HN0t8Rq6LjuFlR",
        outFields : ["*"]
      });

      county.renderer = this.mapStyle("county",2)
      county.popupTemplate=languageTemplate;

      const state = new FeatureLayer({
        // URL to the service
        url:"https://services6.arcgis.com/hERbCYWNM6zA0Lns/arcgis/rest/services/states/FeatureServer/0?token=Fv44uxmOv4FURhIzMj-ZTR8ZYUu9xalc9xwInMG4_Yq2repzEhRx18NmzPuNRFRTPNAI2mxTPY3FKhGvmn2rNYnORZYBaxfX-YYuaIcSBN_bgGfcVe5Ag7ytOk00cb5PQykQtbTn17nyNct_4ez5xhzIfms2YYEKB1Oj4nQNOUtpLss99BD9-fDjZGgmn4dAzIsQSkgbiX_CO5CGoLzq1gG7kY8OrNV4An9phQyBSaCLoYKlBGcXwYksNOQRcSS8",
        outFields : ["*"]
      
      });
      
     state.renderer = this.mapStyle("state",2)
     state.popupTemplate=languageTemplate;
   
     

      const congressional = new FeatureLayer({
        // URL to the service
        url:"https://services6.arcgis.com/hERbCYWNM6zA0Lns/arcgis/rest/services/congressional/FeatureServer/0?token=GCYgmd6hqd7jPSh7cP72ZJaFlaLvAKDyJgidegGN7136QVPcSYG7M8oSoRC_wI-QYMBBvsvBNT6jebc11Mdh4MDpFAN2jVAhGmDYyzDRZdF0m71XiCZXGvowJw1frNH_F4uNicoviPcQMGxVzdEn5eZSzskn7_UsIBUjryH_wcO9pt1sprzZ1nxIio0rJ-_hc3NKog2T3BHMOXyChb3eofYNYKOqi16w_r09x18-yqHy4CSAdPmFxVQ9IVZeVnzE",
        outFields : ["*"]
      });

      congressional.renderer =this.mapStyle("congressional",2) 
        
     



      const map = new Map({
        basemap: "topo-vector",
        layers:[county,congressional,state,usOutline]
      });

      this.view = new MapView({
        container: this.mapRef.current,
        map: map,
        center: [-118, 34],
        zoom: 8
       
      
      });

      
        var layerList = new LayerList({
          view: this.view

      });
        // Add widget to the top right corner of the view
        this.view.ui.add(layerList, {
          position: "top-right"
        });

    });
   
  }
  componentDidUpdate() {
    // check if data has changed
   
  }

  mapStyle=(mapType,weight)=> {
  
    let mapTypeColor;
    let mapTypeColorOpacity;
    switch(mapType){

       case "USA":
       mapTypeColor=[141, 211, 199];
       mapTypeColorOpacity=[141, 211, 199,0.3]
       break;    
       case "state":
       mapTypeColor=[127, 201, 127];
       mapTypeColorOpacity=[127, 201, 127,0.3]
       break;
       case "county":
        mapTypeColor=[190, 186, 218];
        mapTypeColorOpacity=[190, 186, 218, 0.3]
       break;
       case "congressional":
        mapTypeColor=[253, 141, 60];
        mapTypeColorOpacity=[253, 141, 60, 0.3]
       break;
       default :
       mapTypeColor=[255,255,255];
       mapTypeColorOpacity=[255,255,255,0.3]


    }

    return  {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
          size: 5,
          color:mapTypeColorOpacity,
          outline: {  // autocasts as new SimpleLineSymbol()
            width: weight,
            color: mapTypeColor,
            
          }
        }
      };
     
  }

  languageCheck=async (feature) =>{
      const featuresList=feature.graphic["__accessor__"].store["_values"].attributes
     
    let state,county,url;
    let HtmlRender='<div>No Languages Results Found!</div>'
    let regexState = /\d{2}/g
    state=""+featuresList.STATE
    if(state.match(regexState)!==null){
       
    }else{
        state="0"+state;
    }
    
    if(featuresList.COUNTY!==undefined){
      let regexCounty = /\d{3}/g
      county=""+featuresList.COUNTY
      if(county.match(regexCounty)!==null){
        
      }else{
         
         county=(county.length===1)?"00"+county:"0"+county;
      }
      
    url=`https://api.census.gov/data/2013/language?get=EST,LAN7,LANLABEL,NAME&for=county:${county}&in=state:${state}&key=c6b213357c951f788c3eb1916c6d718c59b55a8d`
    }else{

    url=`https://api.census.gov/data/2013/language?get=EST,LAN7,LANLABEL,NAME&for=state:${state}&key=c6b213357c951f788c3eb1916c6d718c59b55a8d`
    
    }
   
    axios.defaults.headers.post['Content-Type'] = 'application/json';

   await axios.get(url)
   
    .then(res => {
      const census= res.data;
      console.log("what is the data",census)
     
      if(res.data!==""){
      
      HtmlRender="<div>";
      for(let i=0;i<census.length;i++){
        if(i!==0){
         HtmlRender+=`<ol><li>EST Population:${census[i][0]}</li>
         <li>LAN7:${census[i][1]}</li>
         <li>LANLABEL:${census[i][2]}</li>
         <li>NAME:${census[i][3]}</li>
         <li>LOCATION:${census[i][4]}</li>
         </ol>
         <hr>
         `
        }
      }
      HtmlRender+="</div>"
      return HtmlRender;
    }
    
   
    
  }) 
    return HtmlRender;
  }
  
 
  render() {
     return(
     <div className="webmap" ref={this.mapRef} />
     )
  }
}

export default Map;

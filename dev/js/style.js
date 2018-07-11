	// get color depending on population density value
   // todo: optimiser
	function getColor(d,colors,min,max) {
/*
      console.log(min);
      console.log(max);
      console.log(d);
         console.log(colors);
*/
         var color="#000000";
         n=colors.length;
         l=max-min;
         dd=l/(n+1);
         for (i=0;i<n;i++){
            if(d>=(dd*(i))){
               color=colors[i]
            }
         }
		return color;
	}
   // retourne les intervalles de données
   function getGrades(colors,min,max){
      n=colors.length;
      l=max-min;
      dd=l/(n+1);
      out=[]
      for (i=0;i<n;i++){
         out.push(dd*(i))
      }
      return out;
   }

class styleData{
   // contient et controle les options de style
   constructor(params){
      this._params={};
      this.init(params);
      };
   checkAndAdd(params,val,def){
      if(typeof params == "undefined"){
         this._params[val]=def;
      }
      else if(params[val]){
         this._params[val]=params[val];
      }else{
         this._params[val]=def;
      }
   };
   init(params){
      //Normal
      this.checkAndAdd(params,"contour-weight",2);
      this.checkAndAdd(params,"contour-opacity",1);
      this.checkAndAdd(params,"contour-color",'white');
      this.checkAndAdd(params,"contour-dashArray",3);
      this.checkAndAdd(params,"contour-fillOpacity",.6);

      this.checkAndAdd(params,"colors",['#d7191c','#fdae61','#abdda4','#2b83ba']);
      this.checkAndAdd(params,"title","Sections de vote");
   };
   get(val){
      return this._params[val];
   }
   setFeature(name,min,max){
      this._params["feature-name"]=name;
      this._params["feature-min"]=min;
      this._params["feature-max"]=max;
   };

   setColor(name){
      if("7-bleu-rouge"==name){
         this._params["colors"]=['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'];
      }else if("6-brun-turquoise"){
         this._params["colors"]=['#8c510a','#d8b365','#f6e8c3','#c7eae5','#5ab4ac','#01665e'];
      }else{
         consolo.log("Warning: la couleur "+name+" n'est pas définie.")
         this._params["colors"]=['#d7191c','#fdae61','#abdda4','#2b83ba'];
      }
   }
   setTitle(title){
      this._params["title"]=title
   }


}

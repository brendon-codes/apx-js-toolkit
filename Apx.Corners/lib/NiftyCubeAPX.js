/**
 * Nifty Corners Cube (APX) - rounded corners with CSS and Javascript
 *
 * @copyright
 * 
 *  2006 Alessandro Fulciniti <a dot fulciniti at html dot it>
 *  2007,2008  <message144 at users dot sourceforge dot net>
 *
 * @license
 * 
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to:
 * 
 *   The Free Software Foundation, Inc.,
 *   51 Franklin St, Fifth Floor,
 *   Boston, MA 02110-1301,
 *   USA
 *
 */

var NiftyCube = function(elm, options){
 Nifty(elm, options);
	
	function Nifty(elm,options){
		var i,h=0;
		if(options==null) options="";
		if(find(options,"fixed-height"))
		    h=elm.offsetHeight;
		Rounded(elm,options);
		if(find(options,"height")) SameHeight(elm,h);
	}
	
	function find(that,what){
		return(that.indexOf(what)>=0 ? true : false);		
	}
	
	function Rounded(elm,options){
		var i,top="",bottom="",v=new Array();
		if(options!=""){
		    options=options.replace("left","tl bl");
		    options=options.replace("right","tr br");
		    options=options.replace("top","tr tl");
		    options=options.replace("bottom","br bl");
		    options=options.replace("transparent","alias");
		    if(find(options,"tl")){
		        top="both";
		        if(!find(options, "tr")) top="left";
		        }
		    else if(find(options,"tr")) top="right";
		    if(find(options,"bl")){
		        bottom="both";
		        if(!find(options,"br")) bottom="left";
		        }
		    else if(find(options,"br")) bottom="right";
		    }
		if(top=="" && bottom=="" && !find(options,"none")){top="both";bottom="both";}
		FixIE(elm);
		    if(top!="") AddTop(elm,top,options);
		    if(bottom!="") AddBottom(elm,bottom,options);
	}
	
	function AddTop(el,side,options){
		var d=CreateEl("b"),lim=4,border="",p,i,btype="r",bk,color;
		d.style.marginLeft="-"+getPadding(el,"Left")+"px";
		d.style.marginRight="-"+getPadding(el,"Right")+"px";
		if(find(options,"alias") || (color=getBk(el))=="transparent"){
		    color="transparent";bk="transparent"; border=getParentBk(el);btype="t";
		    }
		else{
		    bk=getParentBk(el); border=Mix(color,bk);
		    }
		d.style.background=bk;
		d.className="niftycorners";
		p=getPadding(el,"Top");
		if(find(options,"small")){
		    d.style.marginBottom=(p-2)+"px";
		    btype+="s"; lim=2;
		    }
		else if(find(options,"big")){
		    d.style.marginBottom=(p-10)+"px";
		    btype+="b"; lim=8;
		    }
		else d.style.marginBottom=(p-5)+"px";
		for(i=1;i<=lim;i++)
		    d.appendChild(CreateStrip(i,side,color,border,btype));
		el.style.paddingTop="0";
		el.insertBefore(d,el.firstChild);
	}
	
	function AddBottom(el,side,options){
		var d=CreateEl("b"),lim=4,border="",p,i,btype="r",bk,color;
		d.style.marginLeft="-"+getPadding(el,"Left")+"px";
		d.style.marginRight="-"+getPadding(el,"Right")+"px";
		if(find(options,"alias") || (color=getBk(el))=="transparent"){
		    color="transparent";bk="transparent"; border=getParentBk(el);btype="t";
		    }
		else{
		    bk=getParentBk(el); border=Mix(color,bk);
		    }
		d.style.background=bk;
		d.className="niftycorners";
		p=getPadding(el,"Bottom");
		if(find(options,"small")){
		    d.style.marginTop=(p-2)+"px";
		    btype+="s"; lim=2;
		    }
		else if(find(options,"big")){
		    d.style.marginTop=(p-10)+"px";
		    btype+="b"; lim=8;
		    }
		else d.style.marginTop=(p-5)+"px";
		for(i=lim;i>0;i--)
		    d.appendChild(CreateStrip(i,side,color,border,btype));
		el.style.paddingBottom=0;
		el.appendChild(d);
	}
	
	function CreateStrip(index,side,color,border,btype){
		var x=CreateEl("b");
		x.className=btype+index;
		x.style.backgroundColor=color;
		x.style.borderColor=border;
		if(side=="left"){
		    x.style.borderRightWidth="0";
		    x.style.marginRight="0";
		    }
		else if(side=="right"){
		    x.style.borderLeftWidth="0";
		    x.style.marginLeft="0";
		    }
		return(x);
	}
	
	function CreateEl(x){
		return(document.createElement(x));
	}
	
	function FixIE(el){
		if(el.currentStyle!=null && el.currentStyle.hasLayout!=null && el.currentStyle.hasLayout==false)
		    el.style.display="inline-block";
	}
	
	function SameHeight(elm,maxh){
		var i,v=selector.split(","),t,j,els=[],gap;
		    t=elm;
		    if(elm.offsetHeight>maxh) maxh=elm.offsetHeight;
		    elm.style.height="auto";
		    gap=maxh-elm.offsetHeight;
		    if(gap>0){
		        t=CreateEl("b");t.className="niftyfill";t.style.height=gap+"px";
		        nc=elm.lastChild;
		        if(nc.className=="niftycorners")
		            elm.insertBefore(t,nc);
		        else elm.appendChild(t);
		        }
	}
	
	function getParentBk(x){
		var el=x.parentNode,c;
		while(el.tagName.toUpperCase()!="HTML" && (c=getBk(el))=="transparent")
		    el=el.parentNode;
		if(c=="transparent") c="#FFFFFF";
		return(c);
	}
	
	function getBk(x){
		var c=getStyleProp(x,"backgroundColor");
		if(c==null || c=="transparent" || find(c,"rgba(0, 0, 0, 0)"))
		    return("transparent");
		if(find(c,"rgb")) c=rgb2hex(c);
		return(c);
	}
	
	function getPadding(x,side){
		var p=getStyleProp(x,"padding"+side);
		if(p==null || !find(p,"px")) return(0);
		return(parseInt(p));
	}
	
	function getStyleProp(x,prop){
		if(x.currentStyle)
		    return(x.currentStyle[prop]);
		if(document.defaultView.getComputedStyle)
		    return(document.defaultView.getComputedStyle(x,'')[prop]);
		return(null);
	}
	
	function rgb2hex(value){
		var hex="",v,h,i;
		var regexp=/([0-9]+)[, ]+([0-9]+)[, ]+([0-9]+)/;
		var h=regexp.exec(value);
		for(i=1;i<4;i++){
		    v=parseInt(h[i]).toString(16);
		    if(v.length==1) hex+="0"+v;
		    else hex+=v;
		    }
		return("#"+hex);
	}
	
	function Mix(c1,c2){
		var i,step1,step2,x,y,r=new Array(3);
		if(c1.length==4)step1=1;
		else step1=2;
		if(c2.length==4) step2=1;
		else step2=2;
		for(i=0;i<3;i++){
		    x=parseInt(c1.substr(1+step1*i,step1),16);
		    if(step1==1) x=16*x+x;
		    y=parseInt(c2.substr(1+step2*i,step2),16);
		    if(step2==1) y=16*y+y;
		    r[i]=Math.floor((x*50+y*50)/100);
		    r[i]=r[i].toString(16);
		    if(r[i].length==1) r[i]="0"+r[i];
		    }
		return("#"+r[0]+r[1]+r[2]);
	}

}
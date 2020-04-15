import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Button, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Constants } from 'expo';
import Svg, { Path, Circle } from 'react-native-svg';
import Vector from './Vector.js';
import {getGrid, getPoints, getArrow3, getfield1, getfield3} from './physics.js';
import { Audio } from 'expo-av';

export default class SingleField extends React.Component {// This Jawn drawin'


  constructor(props) {

    super(props);

    // Vec2 variable for point 1 'p'
    // p2 = getfield1(p)
    // store p and p2 in state maybe have to extract x and y from p and p2

    var { height, width } = Dimensions.get('screen');

console.log("screen width: " + width);

    var newWidth = width - 100;
    var newHeight = height * 0.75;
    var actualWidth = width;
    // numP is the number of points in a line
    var numP = newWidth * 0.15;
    if (numP % 2 > 0) {
      numP += 1;
    }

    // now create random values for the two charges
    //var ec = Math.floor((Math.random() * 21) - 10);
    //var ec2 = Math.floor((Math.random() * 21) - 10);
    //ec2 = -ec2;


    chargeMid = Math.round(width/2);
    //console.log("width: " + width + " height: " + height + " chargeMid: " + chargeMid);

    const Vect1 = new Vector(chargeMid, 300, 0);
    //const Vect2 = new Vector(newWidth, 300, 0);
    const Vect2 = new Vector(280, 300, 0);
    const Vect3 = new Vector(chargeMid, 290, 0);

    //var A1 = [];

    this.state = {

      // values of the charges on right and left
      value: 0,
      value2: 0,

      //X Coordinates of both charges and line
      x1: Vect1.x,
      x2: Vect2.x,
      x3: Vect3.x,

      //Y Coordinates of both scharges and line
      y1: Vect1.y,
      y2: Vect2.y,
      y3: Vect3.y,

      //X and Y coordinates of the left charge
      px: 0,
      py: 0,

      //X and Y coordinates of the right charge
      ex: 1,
      ey: 0,

      // Number of points in a line
      numPoints: numP,

      // set the device width and height
      devicewidth: actualWidth,
      deviceheight: newHeight,

      // set the dimensions of the Svg View
      // Initially assume device width and height
      // We'll set the actual dimensions when the
      // View is loaded; see the function setSvgDimentions
      SvgDimensions: { width: actualWidth, height: newHeight },

      // set the colors of the charges
      lColor: "grey",
      rColor: "grey",

      A1: this.svgStr(Vect1,Vect3),
    }

    //Pan Handler Set Up for gesture tracking of both the proton and the electron

    this._panResponder = {};
    this._panResponder2 = {};

    //Proton pan handler
    this._previousLeftP = 0;
    this._previousTopP = 0;

    this._protonStyles = {};
    this.proton = null;

    //Electron pan handler
    this._previousLeftE = 0;
    this._previousTopE = 0;

    this._electronStyles = {};
    this.electron = null;

    // these are the sounds
    this.buttonSnd1 = new Audio.Sound();
    this.buttonSnd2 = new Audio.Sound();
    this.buttonSnd3 = new Audio.Sound();
    this.buttonSnd4 = new Audio.Sound();
    this.buttonSnd5 = new Audio.Sound();
    this.buttonSnd6 = new Audio.Sound();
    this.buttonSnd7 = new Audio.Sound();
    this.buttonSnd8 = new Audio.Sound();
    this.buttonSnd9 = new Audio.Sound();
    this.buttonSnd10 = new Audio.Sound();
    this.buttonSnd11 = new Audio.Sound();
    this.buttonSnd1U = new Audio.Sound();
    this.buttonSnd2U = new Audio.Sound();
    this.buttonSnd3U = new Audio.Sound();
    this.buttonSnd4U = new Audio.Sound();
    this.buttonSnd5U = new Audio.Sound();
    this.buttonSnd6U = new Audio.Sound();
    this.buttonSnd7U = new Audio.Sound();
    this.buttonSnd8U = new Audio.Sound();
    this.buttonSnd9U = new Audio.Sound();
    this.buttonSnd10U = new Audio.Sound();
  }

  //Initial functions setting up the sound
  async componentDidMount() {
    // Try audio with Expo
    try {
      await this.buttonSnd1.loadAsync(
        require("../assets/snd/Neg1.mp3")
      ); 
      //await this.backgroundMusic.setIsLoopingAsync(true);
      //await this.backgroundMusic.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd2.loadAsync(
        require("../assets/snd/Neg2.mp3")
      ); 
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd3.loadAsync(
        require("../assets/snd/Neg3.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd4.loadAsync(
        require("../assets/snd/Neg4.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd5.loadAsync(
        require("../assets/snd/Neg5.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd6.loadAsync(
        require("../assets/snd/Neg6.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd7.loadAsync(
        require("../assets/snd/Neg7.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd8.loadAsync(
        require("../assets/snd/Neg8.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd9.loadAsync(
        require("../assets/snd/Neg9.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd10.loadAsync(
        require("../assets/snd/Neg10.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd11.loadAsync(
        require("../assets/snd/bloop3.mp3")
      ); 
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd1U.loadAsync(
        require("../assets/snd/Plus1.mp3")
      ); 
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd2U.loadAsync(
        require("../assets/snd/Plus2.mp3")
      ); 
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd3U.loadAsync(
        require("../assets/snd/Plus3.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd4U.loadAsync(
        require("../assets/snd/Plus4.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd5U.loadAsync(
        require("../assets/snd/Plus5.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd6U.loadAsync(
        require("../assets/snd/Plus6.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd7U.loadAsync(
        require("../assets/snd/Plus7.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd8U.loadAsync(
        require("../assets/snd/Plus8.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd9U.loadAsync(
        require("../assets/snd/Plus9.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd10U.loadAsync(
        require("../assets/snd/Plus10.mp3")
      ); 
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
  }


  //Updates the state of the coordiantes for the line to be drawn
  _updateState(num) {
    if (num == 1) {
      this.setState({
        x1: this.state.px - 10,
        y1: this.state.py + 300,
      })
    }

    if (num == 2) {
      this.setState({
        x2: this.state.ex + 350,
        y2: this.state.ey + 300,
      })
    }
  }

  /* svgStr is only called once, to provide the initial field.
   * We know that ec will be positive and ec2 negative (or vice versa), so the
   * field calculation is simplified, i.e., we do not need to calculate
   * the field from BOTH charges (as we would if they had the same sign).
  */

  svgStr(Vect1,Vect3) {
    var i;
    var j;
    var A2 = new Array();

    var holdVec = new Vector(0, 0, 0);

    var ec = 1;

    if (typeof this.state === "undefined") {
      ec = 1;
    } else {
      ec = this.state.value;
    }

    // use the 'this' if the function is defined within this component
    // if you defined the function in another file (as we did) don't use 'this'
    //holdVec = this.getfield1(Vect1, Vect3, ec);
    holdVec = getfield1(Vect1, Vect3, ec);
    tempArray = new Array();

    for (i = 0; i < 6; i++) {
      for (j = 0; j < 75; j++) {

// Call get field using old starting point to get a new starting point
        holdVec = getfield1(Vect1, holdVec, ec);

        tempArray[j] = [(holdVec.x), (holdVec.y)];
      }

      A2[i] = { line: "M 0 0 L 0 0", key: i, arrow: [0, 0, 0, 0, 0, 0] };

      if (i < 3) {
        Vect3.y -= 5;
      } if (i == 2) {
        Vect3.y += 35;
      } else if (i >= 3 && i < 6) {
        Vect3.y += 5;
      }

      holdVec = getfield1(Vect1,Vect3, ec);
    }

    return A2;
  }

  svgStr2(ec) {
    var i;
    var j;
    var A2 = new Array();

    var Vect3 = new Vector(0, 0, 0);
    var Vect1 = new Vector(this.state.x1, this.state.y1, 0);

    /* This the top of the SVG screen relative to the View.  We must
     * adjust the number because we're scaling the SVG relative to the View.
     *-200 is just a test number. We need to know where
     * the top of the SVG screen is relative to the View 
     */

    screenTop = 100;
    screenBottom = 700;

    // We need to keep the original value of the charge to determine the arrow direction
    var oldEC = ec;
    var thickness = 1;

/*********** These are not currently used **********************
    var svgHeight = 600;
    var svgWidth = 400;
    if (typeof this.state === "undefined" || this.state.SvgDimensions.height == 0) {
      svgHeight = 600;
    }
    else {
      svgHeight = this.state.SvgDimensions.height;
      svgWidth = this.state.SvgDimensions.width;
    }
***************************************************************/

/* Here we set the variable "direction" that indicates
     * which direction the lines go.
     * We also set where to start calculating point charges
    */
   
   if (ec < 0) {
         /* screenTop is set above. We need to know where
    	* the top of the SVG screen is relative to the View 
   	*/
	 ec = -1 * ec;
   }else if (ec == 0){
     tmpStr = "M 0 0 L 0 0"
     A2[0] = { line: tempStr, key: 0, strokWidth: thickness};
     this.setState({
      A1: A2
     })
     return;
   } 
   

    /* Get a grid of points.  E
     * Each point will have a field vector coming out of it
    */ 
    newPts = getGrid(this.state.SvgDimensions.width, this.state.SvgDimensions.height, 50);

    tempStr = "";

    for (i = 0; i < newPts.length; i++) {

      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0);
      holdVec = getfield3(Vect1, Vect3, ec);

      // Create the field vector line
      tempStr = "M " + newPts[i][0] + " " + newPts[i][1] + " L " + holdVec.x + " " + holdVec.y;

      arrowArray = new Array();
      arrowString = "";
      // the start of the vector that will need an arrow
      if (oldEC > 0){
        Elinemidstart = Vect3;
        Elinemidend = holdVec;
      }
      else{
        Elinemidstart = holdVec;
        Elinemidend = Vect3;
     }
     
      thickness = (Elinemidend.subtract(Elinemidstart)).mag() // doesn't matter what direction it points.
      thickness = thickness / 100;
      //thickness = 5;
      
      //console.log("thickness = ");
      //console.log(thickness);
     
     
     	// define the depth (squattiness) and width (wingspan) of the arrow
	  var adepth = 8;
	  var awidth = 10;
	  
	  adepth = (Elinemidend.subtract(Elinemidstart)).mag() / 30;
	  awidth = (Elinemidend.subtract(Elinemidstart)).mag() / 30;

     
      arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend, adepth, awidth);		
      arrowString = " M " + arrowArray[0] + " " + arrowArray[1] + " L " + arrowArray[2] + " " + arrowArray[3] + " " + arrowArray[4] + " " + arrowArray[5];

//console.log("Elinemidstart and end:");
//console.log(Elinemidstart);
//console.log(Elinemidend);

      tempStr = tempStr + arrowString;

      // store this line in the A1 array
      A2[i] = { line: tempStr, key: i, strokWidth: thickness};
      //console.log("thickness = "  + thickness);
    }

    this.setState({
      A1: A2
    })
  }



  //Creates thhe state into a string that can be used for line creation

  _stateToString(num) {

    // line is the property that contains an array of points in A1[num]
    var str7a = this.state.A1[num].line;  //.toString().replace(/,/g, ' ')
    var aLine = this.state.A1[num].arrow;

    first = this.state.value;
    second = this.state.value2;

    var str7 = "";

    if (first == 0) {
      return "M 0 0";
    }

    str7End = str7a.slice(1);

    if (first < 0 ) {
      // in this case start from the first position in str7a and end at x1,y1
      var mid = this.state.A1.length / 2;

      /* We start at the end of the line in this situation, not at the charge.
       * So we have to find the first point and draw the line from there to
       * the rest of the points stored in str7. This is the only situation where
       * we have to start at the end of the line.
      */
      lastX = str7End[str7End.length - 1][0];
      if (num < mid) {

        str7 = "M " + str7a[0][0] + "," + str7a[0][1] + " L " + str7End + " ";
        str7 = str7 + this.state.x1 + " " + this.state.y1;

	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];

      } else { // num >= mid

        str7 = "M " + str7a[0][0] + "," + str7a[0][1] + " L " + str7End + " ";
        str7 = str7 + this.state.x1 + " " + this.state.y1;

	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
      }
    }
    else {   // the charge is positive

      var mid = this.state.A1.length / 2;
      if (num < mid) {
        //str7 = "M " + this.state.x1 + "," + this.state.y1 + " L " + str7a;
        str7 = "M " + str7a[0][0] + ", " + str7a[0][1] + " L " + str7End + " ";
	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
      } else {
        //str7 = "M " + this.state.x1 + ", " + this.state.y1 + " L " + str7a;
        str7 = "M " + str7a[0][0] + ", " + str7a[0][1] + " L " + str7End + " ";
	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
      }
    }
    return str7
  }



  //Updates the state based on the sliders value

  _sliderChange(value) {

   // this should play the button sound
   var oldValue = this.state.value;
   //play sound if it has loaded and we're going down in charge

   switch(value) {
     case 1:
       // code block
       this.buttonSnd1U.replayAsync();
       break;
     case 2:
       // code block
       this.buttonSnd2U.replayAsync();
       break;
     case 3:
       // code block
       this.buttonSnd3U.replayAsync();
       break;
     case 4:
       // code block
       this.buttonSnd4U.replayAsync();
       break;
     case 5:
       // code block
       this.buttonSnd5U.replayAsync();
       break;
     case 6:
       // code block
       this.buttonSnd6U.replayAsync();
       break;
     case 7:
       // code block
       this.buttonSnd7U.replayAsync();
       break;
     case 8:
       // code block
       this.buttonSnd8U.replayAsync();
       break;
     case 9:
       // code block
       this.buttonSnd9U.replayAsync();
       break;
     case 10:
       // code block
       this.buttonSnd10U.replayAsync();
       break;
     case -1:
       // code block
       this.buttonSnd1.replayAsync();
       break;
     case -2:
       // code block
       this.buttonSnd2.replayAsync();
       break;
     case -3:
       // code block
       this.buttonSnd3.replayAsync();
       break;
     case -4:
       // code block
       this.buttonSnd4.replayAsync();
       break;
     case -5:
       // code block
       this.buttonSnd5.replayAsync();
       break;
     case -6:
       // code block
       this.buttonSnd6.replayAsync();
       break;
     case -7:
       // code block
       this.buttonSnd7.replayAsync();
       break;
     case -8:
       // code block
       this.buttonSnd8.replayAsync();
       break;
     case -9:
       // code block
       this.buttonSnd9.replayAsync();
       break;
     case -10:
       // code block
       this.buttonSnd10.replayAsync();
       break;
     default:
       // code block
       this.buttonSnd11.replayAsync();
}

    var newLColor;
    var newRColor;
    if (value < 0) {
      newLColor = "red";
    }
    else if (value > 0) {
      newLColor = "blue";
    }
    else {
      newLColor = "grey";
    }


    this.setState({
      lColor: newLColor,
    })

    this.setState({
      value: value,
      lColor: newLColor,
    })

    this.forceUpdate();

    this.svgStr2(value);

  }

  // Note that this function is called when the "onlayout" event
  // of the Svg component is called.  the height and width provided
  // are not the height/width of the surrounding view, rather the 
  // current height and width which vary depending on how much room is needed.

  // Organization of the screen
  //Container
  //First Row
  //Middle Column
  //Second Row
  //The Proton
  //The two field lines between the particles
  //The Electron
  //Third Row
  //First Column
  //Second Column
  //Dynamic Slider used to update the arcs
  //Third Column
  //Fourth Row

  render() {

    return (

      <View style={styles.container}>

        <View style={styles.firstrow}>

          <View style={styles.secondcol}>

            <Text style={styles.bigText}>Dynamic Electric Field Interactive</Text>

          </View>

        </View>

        <View style={styles.secondrow}>
          {/* onLayout = {event => this.setSvgDimentions(event) } */}



{/*
          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 1000 1000">
            <Svg height='600' width='600' xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 800 800" >
            <Svg height='600' width='600' xmlns="http://www.w3.org/2000/svg">
            </Svg>

                  return <Path key={obj.key} d={this._stateToString(i)} stroke="#FFFF00" strokWidth='100' fill="none" />
*/}
          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg">

              {
                //this.state.A1.map((obj, i) => {// Not Chainging A1 here
                this.state.A1.map((obj, i, strokWidth) => {// Not Chainging A1 here

                 // return <Path key={obj.key} d={obj.line} stroke="#FFFF00" strokWidth={obj.strokWidth} fill="none" />
                 
      			return <Path key={obj.key} d={obj.line} stroke="#FFFF00" strokeWidth={obj.strokWidth} fill="yellow" />
      			//console.log("obj.strokWidth = "  + obj.strokWidth);
//      			return <Path key={obj.key} d={obj.line} stroke="#FFFF00" strokeWidth="1" fill="yellow" />
                })

              }

              <Circle cx={this.state.x1} cy={this.state.y1} r="15" stroke="#FFFF00" strokeWidth="3" fill={this.state.lColor} />

          </Svg>

        </View>

        <View style={styles.thirdrow}>

          <View style={styles.firstcol}>

            <Text style={styles.sliderText}>-10 C</Text>

          </View>

          <View style={styles.secondcol}>

            <Slider
              style={styles.slider}
              step={1}
              minimumValue={-10}
              maximumValue={10}
              value={this.state.value}
              //value2={this.state.value2}

              onValueChange={(value) => this._sliderChange(value)}// cALL SVGtoStr here
            />

          </View>

          <View style={styles.thirdcol}>

            <Text style={styles.sliderText}>+10 C</Text>

          </View>

        </View>



        <View style={styles.fourthrow}>

          <Text style={styles.selectText}>Charge Amount</Text>
          <Text style={styles.selectText}>{this.state.value} C</Text>

        </View>

      </View>
    );

  }


};
  
//Multiple styles used throughout
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111110',
    flex: 1,
  },

  containerSplash: {
    backgroundColor: '#111110',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigText: {
    marginTop: 60,
    fontSize: 25,
    color: '#fff',
    fontFamily: 'Arial',
  },

  sliderText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Arial',
    textAlign: 'center',
    padding: 20,
  },

  selectText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Arial',
    textAlign: 'center',
  },

  firstrow: {
    flex: .5,
  },

  secondrow: {

    flex: 2.2,

    flexDirection: 'row',

    alignItems: "center",


  },

  thirdrow: {
    flex: .3,
    flexDirection: 'row',
    alignItems: "center",
  },

  fourthrow: {
    flex: .5,
    alignItems: "center",
  },

  firstcol: {
    flex: 1,
    alignItems: 'flex-start',
  },

  secondcol: {
    flex: 1,
    alignItems: 'center',
  },

  thirdcol: {
    flex: 1,
    alignItems: 'flex-end',
  },

  slider: {
    width: 150,
    justifyContent: 'center',
  },

  electron: {
    width: 35,
    height: 35,
    borderRadius: 100 / 2,
    backgroundColor: '#97A2E7',
  },

  proton: {
    width: 35,
    height: 35,
    borderRadius: 100 / 2,
    backgroundColor: '#EF7A1A',
  },

  buttonTing: {
    position: 'absolute',
    top: 20,
    left: 40
  },

});

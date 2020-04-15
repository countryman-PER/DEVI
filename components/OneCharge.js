import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Button, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Constants } from 'expo';
import Svg, { Path, Circle } from 'react-native-svg';
import Vector from './Vector.js';
import {getPoints, getArrow3, getfield1} from './physics.js';
import { Audio } from 'expo-av';

export default class SingleCharge extends React.Component {// This Jawn drawin'


  constructor(props) {

    super(props);

    var { height, width } = Dimensions.get('screen');

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

    const Vect1 = new Vector(chargeMid, 300, 0);
    const Vect2 = new Vector(280, 300, 0);
    const Vect3 = new Vector(chargeMid, 290, 0);

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
      SvgDimensions: { width: actualWidth, height: newHeight },

      // set the colors of the charges
      lColor: "grey",
      rColor: "grey",

      A1: this.svgStr(Vect1,Vect3),
    }

  }

  //Initial functions setting up the pan handlers
  async componentWillMount() {
    // Load sounds using Expo Audio
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

  /* 
   * svgStr is only called once, to provide the initial field which is null.
  */

  svgStr(Vect1,Vect3) {
    A2 = new Array();
    for (i = 0; i < 6; i++) {
      for (j = 0; j < 75; j++) {
        A2[i] = { line: "M 0 0", key: i};
    }
   }
   return A2;
  }

  svgStr2(ec) {
    var i;
    var j;
    /* A2 is an array of objects.  Each object contains two fields, a string that is
     * the svg coordinates of a line (with it's arrow) and a key value (the index of
     * this object in A2) which is needed when the svg line is displayed in a view.
    */
    var A2 = new Array();

    // Vect1 is the charge
    var Vect1 = new Vector(this.state.x1, this.state.y1, 0);
    // Vect3 contains the next point charge
    var Vect3 = new Vector(0, 0, 0);
    // These are used to vary the arrow size
    var adepth = 8;
    var awidth = 10;

    // The "direction" variable determines the direction of the line, "up" or "down"
    // Just giving a default value here.
    var direction = "down";

    var svgHeight = 600;
    var svgWidth = 300;
    var arrowPoint = 22;
    if (typeof this.state === "undefined" || this.state.SvgDimensions.height == 0) {
      svgHeight = 600;
    }
    else {
      svgHeight = this.state.SvgDimensions.height;
      svgWidth = this.state.SvgDimensions.width;
    }

    /* Here we set the variable "direction" that indicates
     * which direction the lines go, down into the charge or up out of the charge.
     * We need to know the direction of the lines for drawing arrows
    */
   if (ec < 0) {
         direction = "down";
	 arrowPoint = 15;
	/* 
	 * We draw all lines as though the charge was positive since the field lines are the same 
	*/
	ec = -ec;
   } else {
         direction = "up";
	 arrowPoint = 15;
   }
   
    var angle = 10.01;
    // the "+ 0.01" is because an angle of exactly 90 degrees confuses the arrow calculation
    angle = (360/(10*Math.abs(ec)))+ 0.01;

    newPts = getPoints(Vect1, 10, angle);

    // get the max number of points in a line
    pts = this.state.numPoints;

    for (i = 0; i < newPts.length; i++) {

      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0);
      lineString = "M " + Vect3.x + " " + Vect3.y + " L";
      holdVec = getfield1(Vect1, Vect3, ec);
      lineString = lineString + " " + holdVec.x + " " + holdVec.y;


      arrowArray = new Array();
      Elinemidstart = new Vector(0,0,0);
      Elinemidend = new Vector(0,0,0);

      // flag to signal start/end of creating new points
      keepGoing = "true";

      j = 0;
      while(keepGoing == "true"){
	j = j + 1;
        // Call get field using old starting point to get a new 
	// starting point
        holdVec = getfield1(Vect1,holdVec, ec);
        lineString = lineString + " " + holdVec.x + " " + holdVec.y;

     	if ((holdVec.x < 0 || holdVec.x > svgWidth) && j > 10){
		keepGoing = "false";
	}
     	if ((holdVec.y < 0 || holdVec.y > svgHeight) && j > 10){
		keepGoing = "false";
	}
	// pts is the upper limit of what we calculate
	if (j > pts){
		keepGoing = "false";
	}


	/* CLC 191010, to create the arrows
	 * first, we focus on the segment in the middle of the line. 
	 * We need to get the start (Elinemidstart) and end point (Elinemidend) of this segment.
	*/
	if (direction == "up"){
	   if (j == arrowPoint) {
		Elinemidstart= holdVec;
	   }
	   if (j == arrowPoint + 1) {
		Elinemidend = holdVec;
		arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend, adepth, awidth);	
		//arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend);		
	   }
	}
	else{  
	   /* direction is down so arrows point a different direction.  getArrow3 
	    * must draw the arrow in a different direction than we're creating them, so
	    * we get the arrow line start and end points at different places.
	   */
	   if (j == arrowPoint) {
		Elinemidstart= holdVec;
		/* Note that the charge is negative but we changed ec to be positive
		 * since we're drawing all lines as positive.  But for creating the arrow, we
		 * need the charge to be negative, thus the "-ec" parameter.
		*/
		arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend, adepth, awidth);	
		//arrowArray = getArrow3(-ec, Vect1, Elinemidstart, Elinemidend);		
	   }
	   if (j == arrowPoint - 1) {
		Elinemidend = holdVec;
	   }
	}
      }

      if (arrowArray.length < 1 || isNaN(arrowArray[0])){
	arrowArray = [0, 0, 0, 0, 0, 0];
      }

      // Create the SVG parameters for the arrow
      arrowString = " M " + arrowArray[0] + " " + arrowArray[1] + " L " + arrowArray[2] + " " + arrowArray[3] + " " + arrowArray[4] + " " + arrowArray[5];
      // store this line in the A1 array
      lineString = lineString + arrowString;
      // Don't draw a line if the charge is 0!
      if (ec == 0){
	lineString = "M 0 0";
      }
      A2[i] = { line: lineString, key: i};
    }

    this.setState({
      A1: A2
    })
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

          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg">

              {
                this.state.A1.map((obj, i) => {// Not Chainging A1 here

                  return <Path key={obj.key} d={obj.line} stroke="#FFFF00" strokWidth='100' fill="none" />

                })
              }

              <Circle cx={this.state.x1} cy={this.state.y1} r="15" fill={this.state.lColor} />

          </Svg>

          {/* <View style={styles.buttonTing}>
  
            <Button
              onPress={() => {
  
                this.setState({
  
                  str6: "M169.8 200 L200 180",
                  str7: "M169.8 200 L200 220"
  
                })
                { this._stateToString(6, 7) }
              }}
  
              title="Flip"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
  
            />
  
            </View> */}



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

              onValueChange={(value) => this._sliderChange(value)}// cALL SVGtoStr here
            />

          </View>

          <View style={styles.thirdcol}>

            <Text style={styles.sliderText}>+10 C</Text>

          </View>

        </View>



        <View style={styles.fourthrow}>

          <Text style={styles.selectText}>Charge Amount</Text>
          <Text style={styles.selectText}>{this.state.value} C </Text>

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

  buttonTing: {
    position: 'absolute',
    top: 20,
    left: 40
  },

});

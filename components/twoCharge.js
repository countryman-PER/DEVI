import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Button, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { createAppContainer } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Path, Circle } from 'react-native-svg';
import { TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import { getPoints, getfield2, getArrow2, getArrow3 } from './physics.js';
import Vector from './Vector.js';
import { Audio } from 'expo-av';

/*  PEV
*   references:
 *     SVG: https://github.com/react-native-community/react-native-svg
*
*  The path of field lines is created via SVG graphics.  In particular,
*  the "path" SVG grphic is used.  A path can be created in various ways
*  (see also the reference page):
*
*  The following commands are available for path data:
* 
*  M = moveto
*  L = lineto
*  H = horizontal lineto
*  V = vertical lineto
*  C = curveto
*  S = smooth curveto
*  Q = quadratic Bézier curve
*  T = smooth quadratic Bézier curveto
*  A = elliptical Arc
*  Z = closepath
*/

class AppScreen extends React.Component {

  constructor(props) {

    super(props);

    // Vec2 variable for point 1 'p'
    // p2 = getfield(p)
    // store p and p2 in state maybe have to extract x and y from p and p2

    var { height, width } = Dimensions.get('window');

    var newWidth = width - 100;
    var newHeight = Math.round(height * 0.75);
    var actualWidth = width;

    this.leftCharge;  // will be a pointer to the left charge
    this.leftText;    // will be a pointer to the text in the left charge
    this.rightText;    // will be a pointer to the text in the right charge
    this.leftChargeStyle = {}; // will use this to change position

    /* numP is the number of points in a line
     * it's stored in state as "numPoints"
     * it's used in svgStr2 in a for loop
    */
    var numP = newWidth * 0.17;
    if (numP % 2 > 0){
	numP += 1;
    }

    // now create random values for the two charges
    //var ec = Math.floor((Math.random() * 21) - 10);
    //var ec2 = Math.floor((Math.random() * 21) - 10);
    //ec2 = -ec2;


    const Vect1 = new Vector(100, 300, 0);
    const Vect2 = new Vector(newWidth, 300, 0);
    //const Vect2 = new Vector(400, 300, 0);
    const Vect3 = new Vector(25, 290, 0);

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
      px: Vect1.x,
      py: Vect1.y,

      //X and Y coordinates of the right charge
      ex: Vect2.x,
      ey: Vect2.y,

      // Number of points in a line
      numPoints: numP,

      // set the device width and height
      devicewidth: actualWidth,
      deviceheight: newHeight,

      // set the dimensions of the Svg View
      // Initially assume device width and height
      // We'll set the actual dimensions when the
      // View is loaded; see the function setSvgDimentions
      SvgDimensions: {width:actualWidth, height:newHeight},

      //strings used to flip the arrrows
      str5: "M169.8 200 L149 180",
      str6: "M169.8 200 L149 220",

      // set the colors of the charges
      lColor: "grey",
      rColor: "grey",

      // set the sliders to visible
      // TODO:  change this to a boolean, e.g., false
      sliderVisible: false,
      sliderVisible2: false,

      // set the strokes for the circles
      cStroke: 'none',
      cStroke2: 'none',

      // set loading to true for the sound
      loading: true,

      A1: this.svgStr(Vect1, Vect2, Vect3),
    }

  }

 async componentWillMount() {

    alert('Click screen to see slider');

    // Try audio with Expo
    this.buttonSnd1 = new Audio.Sound();
    this.buttonSnd2 = new Audio.Sound();
    try {
      await this.buttonSnd1.loadAsync(
        require("../assets/snd/beep2.mp3")
      ); 
      //await this.backgroundMusic.setIsLoopingAsync(true);
      //await this.backgroundMusic.playAsync();
      // Your sound is playing!
	
      this.setState({
        loading: false
      })
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd2.loadAsync(
        require("../assets/snd/bloop3.mp3")
      ); 
      //await this.backgroundMusic.setIsLoopingAsync(true);
      //await this.backgroundMusic.playAsync();
      // Your sound is playing!
      this.setState({
        loading: false
      })
    } catch (error) {
      // An error occurred!
      console.log("sound did not load!");
      console.log(error);
    }  
    try {
      await this.buttonSnd2.loadAsync(
        require("../assets/snd/bloop3.mp3")
      ); 
      //await this.backgroundMusic.setIsLoopingAsync(true);
      //await this.backgroundMusic.playAsync();
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

  svgStr(Vect1, Vect2, Vect3) {//new function
    A2 = new Array();
    for (i = 0; i < 6; i++) {
      for (j = 0; j < 75; j++) {
        A2[i] = { line: "M 0 0", key: i};
    }
   }
   return A2;
  }

  svgStr2(e, e2) {  //new function

    var i;
    var j;
    var A2 = new Array();
    var ec = e;
    var ec2 = e2;

    if (e == e2 == 0){
    }

    var Vect3 = new Vector(0, 0, 0);
    Vect1 = new Vector(this.state.x1, this.state.y1, 0);
    Vect2 = new Vector(this.state.x2, this.state.y2, 0);
    // These are used to vary the arrow size
    var adepth = 8;
    var awidth = 10;

    /* This the top of the SVG screen relative to the View.  We must
     * adjust the number because we're scaling the SVG relative to the View.
     *-200 is just a test number. We need to know where
     * the top of the SVG screen is relative to the View 
     */
     //screenTop = -200;
     screenTop = 100;
     screenBottom = 700;

    // this variable determines the direction of the line, right to left or
    // left to right or both (when charges are the same).
    // Just giving a default value here.
    var direction = "LtoR";
    // arrowPoint is the place in the line where we'll place the arrow
    var arrowPoint = 22;

    var svgHeight = 600;
    if (typeof this.state === "undefined" || this.state.SvgDimensions.height == 0) {
	svgHeight = 600;
    }
    else{
	svgHeight = this.state.SvgDimensions.height;
    }

    /* left charge is neg and right charge is pos
     * Here we set the variable "direction" that indicates
     * which direction the lines go.
     * We also set where to start calculating point charges
    */
    var newPts = new Array();
    if (ec  < 0 && ec2 > 0) {
      direction = "RtoL";
      newPts = getPoints(Vect2, 10, 10.01);
      arrowPoint = 17;
    }
    // left charge is pos and right charge is neg
    else {
      if (ec > 0 && ec2 < 0){
        direction = "LtoR";
        newPts = getPoints(Vect1, 10, 10.01);
        arrowPoint = 17;
      }
      else if ((ec < 0 && ec2 <= 0) || (ec <= 0 && ec2 < 0)){
        /* screenTop is set above. We need to know where
	 * the top of the SVG screen is relative to the View 
	*/
     	direction = "down";
	if (ec == 0){
		angle = 10.01;
	}
	else{
	  angle = (360/(10*Math.abs(ec))) + .01;
	}
        newPts = getPoints(Vect1, 10, angle);
	ec = -1 * ec;
	ec2 = -1 * ec2;
        arrowPoint = 17;
      } else if ((ec >= 0 && ec2 > 0) || (ec > 0 && ec2 >= 0)){
        direction = "up";
	if (ec == 0){
		angle = 10.01;
	}
	else{
	  angle = (360/(10*Math.abs(ec))) + .01;
	}
        newPts = getPoints(Vect1, 10, angle);
        arrowPoint = 17;
      }
    }

    var holdVec = new Vector(0, 0, 0);

    // get the number of points in a line
    pts = this.state.numPoints;

    for (i = 0; i < newPts.length; i++) {
      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0); 
      lineString = "M " + Vect3.x + " " + Vect3.y + " L";
      holdVec = getfield2(Vect1, Vect2, Vect3, ec, ec2);
      lineString = lineString + " " + holdVec.x + " " + holdVec.y;

      arrowArray = new Array();
      Elinemidstart = new Vector(0,0,0);
      Elinemidend = new Vector(0,0,0);

      for (j = 1; j < pts*2; j++) {


        // Call get field using old starting point to get a new starting point
        holdVec = getfield2(Vect1, Vect2, holdVec, ec, ec2);
        lineString = lineString + " " + holdVec.x + " " + holdVec.y;

        /* CLC 191010, to create the arrows
         * first, we focus on the segment in the middle of the line.
         * We need to get the start (Elinemidstart) and end point (Elinemidend) 
	 * of this segment.
	*/
        if (direction == "down"){
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
        else{  // in all other cases...
           if (j == arrowPoint) {
                Elinemidstart= holdVec;
           }        
           if (j == arrowPoint + 1) {
                Elinemidend = holdVec;
		arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend, adepth, awidth);	
                //arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend);
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

   /**********************************************************************/
   /* If the charges are both positive or both negative
    * then we've already calculated the field lines from the left charge
    * and now we'll need to create the field lines from the right charge.
   */
   /**********************************************************************/
    
    // must calculate the current length of newPts before we recalculate it!
    var offset = newPts.length;

    if ((ec >= 0 && ec2 > 0) || direction == "down"){ 

	angle = (360/(10*Math.abs(ec2))) + .01;
        newPts = getPoints(Vect2, 10, angle);
        arrowPoint = 17;

     for (i = 0; i < newPts.length; i++) {

      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0); 
      lineString = "M " + Vect3.x + " " + Vect3.y + " L";
      holdVec = getfield2(Vect1, Vect2, Vect3, ec, ec2);
      lineString = lineString + " " + holdVec.x + " " + holdVec.y;

      arrowArray = new Array();
      Elinemidstart = new Vector(0,0,0);
      Elinemidend = new Vector(0,0,0);

      for (j = 1; j < pts*2; j++) {

        // Call get field using old starting point to get a new starting point
        holdVec = getfield2(Vect1, Vect2, holdVec, ec, ec2);
        lineString = lineString + " " + holdVec.x + " " + holdVec.y;

        // CLC 191010, to create the arrows
        // first, we focus on the segment in the middle of the line.
        // We need to get the start (Elinemidstart) and end point (Elinemidend) of this segment.
        if (direction == "down"){
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
        else{  // in all other cases...
           if (j == arrowPoint) {
                Elinemidstart= holdVec;
           }        
           if (j == arrowPoint + 1) {
                Elinemidend = holdVec;
		arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend, adepth, awidth);	
                //arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend);
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
      if (ec2 == 0){
	lineString = "M 0 0";
      }

     // store this line in the A2 array
      A2[offset + i] = { line: lineString, key: offset + i};

     }
   }

    this.setState({
      A1: A2
    })
  }

  //Updates the state based on the sliders value
  _sliderChange(value) {
   var value2;
   var oldValue; 
   var oldValue2;

    var newColor;
    if (value < 0){
	newColor = "red";
    }
    else if (value > 0){
  	newColor = "blue";
    }
    else{
	newColor = "grey";
    }

   // figure out which charge is being changed.
   if (this.state.sliderVisible){
	value2 = this.state.value2;
        oldValue = this.state.value;
    	this.setState({
      		value: value,
      		lColor: newColor,
    	})
   }else if (this.state.sliderVisible2){
	value2 = this.state.value;
   	oldValue = this.state.value2;
    	this.setState({
      		value2: value,
      		rColor: newColor,
    	})
   } else{
        return;
   }
   
   // this should play the button sound
   //play sound if it has loaded and we're going down in charge
   if (!(this.state.loading) && (value < oldValue)){
     this.buttonSnd2.replayAsync();
   }
   else if (!(this.state.loading) && (value > oldValue)){
     this.buttonSnd1.replayAsync();
   }

    this.forceUpdate();

   // must pass the values in the correct order to svgStr2
   // we make this change here so that the sound plays correctly
   if (this.state.sliderVisible2){
   temp = value;
   value = value2;
   value2 = temp;
   }
   this.svgStr2(value, value2);
  }

  _onPressCircle = event => {
    var newValue = true;
    var newValue2 = true;
    var newStroke = 'none';
    var newStroke2 = 'none';
    temp = this.state.sliderVisible;
    temp2 = this.state.sliderVisible2;
    // we use px, py to set the text position for the left charge
    leftX = this.state.x1;
    leftY = this.state.y1;
    rightX = this.state.x2;
    rightY = this.state.y2;

    // get the location of the touch:
    tX = event.nativeEvent.locationX;
    tY = event.nativeEvent.locationY;
      //px: event.nativeEvent.locationX,
      //py: event.nativeEvent.locationY,

    if (tX < leftX + 30 && tX > leftX - 30 && tY > leftY - 30 && tY < leftY + 30){
      if (temp){
	newValue = false;
        newStroke = 'none'
	newValue2 = false;
      }
      else{
	newValue = true;
        newStroke = 'yellow'
	newValue2 = false;
      }
    this.setState({
      sliderVisible: newValue,
      sliderVisible2: newValue2,
      cStroke: newStroke,
      cStroke2: newStroke2,
      px: this.state.x1,
      py: this.state.y1,
    })

   }else if (tX < rightX + 30 && tX > rightX - 30 && tY > rightY - 30 && tY < rightY + 30){
      if (temp2){
	newValue2 = false;
        newStroke2 = 'none'
	newValue = false;
      }
      else{
	newValue2 = true;
        newStroke2 = 'yellow'
	newValue = false;
      }
    this.setState({
      sliderVisible: newValue,
      sliderVisible2: newValue2,
      cStroke: newStroke,
      cStroke2: newStroke2,
      ex: this.state.x2,
      ey: this.state.y2,
    })
  }
    //alert('Set sliderVisible to ' + newValue);
}

  //Updating the left charge style
/************ not used yet ****************/
/*
_updateNativeStyles() {
    this.leftText && this.leftText.setNativeProps(this._leftChargeStyle);
  }
*/

_leftSliderTextStyle = function() {
   var newX = this.state.px -7;
   var newY = this.state.py;
   return {
     position:'absolute',
     top: newY,
     left: newX,
     fontSize: 20,
     color: '#FFFFFF',
     backgroundColor: '#000000',
   }
 }

_rightSliderTextStyle = function() {
   var newX = this.state.ex;
   var newY = this.state.ey;
   return {
     position:'absolute',
     top: newY,
     left: newX,
     fontSize: 20,
     color: '#FFFFFF',
     backgroundColor: '#000000',
   }
 }
   // Note that this function is called when the "onlayout" event
   // of the Svg component is called.  the height and width provided
   // are not the height/width of the surrounding view, rather the 
   // current height and width which vary depending on how much room is needed.

//   setSvgDimentions = event => {
    //if (this.state.SvgDimensions) return 
//    let {width, height} = event.nativeEvent.layout;
//    this.setState({SvgDimensions: {width, height}});
//    console.log("new Svg dimentions are " + width + " and " + height); 
//  }

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

        <View style={styles.secondrow}

	ref={(electron) => {
              this.leftCharge = electron;
            }}

	onLayout={({nativeEvent}) => {
	    if (this.leftCharge) {
      		this.leftCharge.measure((x, y, width, height, pageX, pageY) => {
                console.log(x, y, width, height, pageX, pageY);
       	        })
    	     }
	}}
	>
{/*
        <View style={styles.secondrow}
	 >
                return <Path key={obj.key} d={this._stateToString(i)} stroke="#FFFF00" strokeWidth='1' fill="none" />
*/}

 	<TouchableHighlight onPress={this._onPressCircle} underlayColor="black">


          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg" 
  	  >

            {
              this.state.A1.map((obj,i) => {// Not Chainging A1 here
		
                  return <Path key={obj.key} d={obj.line} stroke="#FFFF00" strokeWidth='1' fill="none" />

              })

            }

	<Circle cx={this.state.x1} cy={this.state.y1} r="20" fill={this.state.lColor} stroke={this.state.cStroke}
	/>

	<Circle cx={this.state.x2} cy={this.state.y2} r="20" fill={this.state.rColor} stroke={this.state.cStroke2}
	/>

          </Svg>
	</TouchableHighlight>

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
	<Text style={this._leftSliderTextStyle()}
	    ref={(theText) => {
              this.leftText = theText;
            }}
	>
	{this.state.value + "C"}
	</Text>
	<Text style={this._rightSliderTextStyle()}
	    ref={(theText) => {
              this.rightText = theText;
            }}
	>
	{this.state.value2 + "C"}
	</Text>

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
		// can use onValueChange but this causes constant updating of field lines

              onSlidingComplete={(value) => this._sliderChange(value)}// cALL SVGtoStr here
            />
          </View>

          <View style={styles.thirdcol}>
            <Text style={styles.sliderText}>10 C</Text>
          </View>
        </View>

	{/* this.state.sliderVisible2 &&
        <View style={styles.fourthrow}>
          <View style={styles.firstcol}>
            <Text style={styles.sliderText}>-10 C</Text>
          </View>

          <View style={styles.secondcol}>

            <Slider
              style={styles.slider}
              step={1}
              minimumValue={-10}
              maximumValue={10}
              value={this.state.value2}

              //minimumTrackTintColor="#FFFFFF"
              //maximumTrackTintColor="#000000"

              onSlidingComplete={(value2) => this._sliderChange(this.state.value, value2)}
            />
          </View>

          <View style={styles.thirdcol}>
            <Text style={styles.sliderText}>10 C</Text>
          </View>
        </View>

	*/}

	{/* this.state.sliderVisible &&
        <View style={styles.fourthrow}>

          <Text style={styles.selectText}>Charge Amount</Text>
          <Text style={styles.selectText}>Left: {this.state.value}C Right: {this.state.value2}C</Text>

        </View>
	*/}

      </View>
    );

  }
} // end AppScreen component

export default AppScreen;


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
    flex: .3,
    flexDirection: 'row',
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
    width: 160,
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

  sliderText1: {
    position: 'absolute',
    top: 280,
    left: 92,
    fontSize:24,
    color:'#FFFF00'
  },

});

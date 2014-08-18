/* @pjs preload="stickman_walking_0.png,stickman_walking_1.png,stickman_walking_2.png,line_0.png,line_1.png,line_2.png,paper_background.jpg"; */

/*
-------------------------------------------------------------------------------
GLOBAL CONFIGURATION
Only changes those if you know what you doing.
-------------------------------------------------------------------------------
*/
final static float  NOTEBOOK_LEFT_MARGIN = 40;
final static int    NOTEBOOK_NUMBER_OF_LINES = 20;
final static int    NOTEBOOK_TEXT_STARTING_LINE = 4;
final static color  NOTEBOOK_MARGIN_COLOR = 0x99FF0000; //AARRGGBB
final static color  NOTEBOOK_LINE_COLOR = 0x990000FF; //AARRGGBB
final static float  NOTEBOOK_LINE_MAX_YPOSITION_VARIATION = 20;
final static int    NOTEBOOK_LINE_NUMBER_OF_VERTEXS = 30;
final static int    NOTEBOOK_LINE_HIT_RADIUS = 30;
final static float  NOTEBOOK_LINE_RELEASE_SPEED = 2;

final static color  LIVETEXT_FONT_COLOR = 55;
final static float  LIVETEXT_FONT_WEIGHT = 1.8;
final static float  LIVETEXT_FONT_SIZE = 23;
final static float  LIVETEXT_FONT_BASELINE = 1;
final static float  LIVETEXT_MORPH_SPEED = 20;
final static float  LIVETEXT_MAX_MOVING_DISTANCE = 200;
final static float  LIVETEXT_MAX_TWISTING_ANGLE = 180;
final static float  LIVETEXT_CHANCE_TO_LOOSE_ORIGINAL_FORM = 0.5;

/*
-------------------------------------------------------------------------------
SETUP AND MAIN LOOP
Sketch by Miguel Peres
Last updated on August 9, 2014
-------------------------------------------------------------------------------
*/
ArrayList<MouseListener> mouseListeners;
NotebookPage page;

void setup() {
  size(768, 1024);
  mouseListeners = new ArrayList<MouseListener>();
  page = new NotebookPage(NOTEBOOK_NUMBER_OF_LINES);
}

void draw() {
  background(255);
  page.draw();
}

/*
-------------------------------------------------------------------------------
EASING EQUATIONS
Based on the work by Robbert Penner (http://www.robertpenner.com/)
-------------------------------------------------------------------------------
*/
float easeInQuad(float time, float begin, float change, float duration) {
  return change * (time/=duration) * time + begin;
}
float easeOutQuad(float time, float begin, float change, float duration) {
  return -change * (time/=duration) * (time-2) + begin;
}
float easeOutElastic(float time, float begin, float change, float duration) {
  float amplitude = change;
  float period = duration * 0.3;
  float s = period/4;
  if (time == 0) return begin;
  if ((time/=duration) == 1) return begin+change;
  return amplitude*pow(2,-10*time) * sin( (time*duration-s)*(2*PI)/period ) + change + begin;
}

/*
-------------------------------------------------------------------------------
MOUSE HANDLING
These functions are responsible to propagate mouse events to subscriber objs.
-------------------------------------------------------------------------------
*/
void subscribeToMouseEvents(MouseListener mouseListener) {
  mouseListeners.add(mouseListener);
}
void unsubscribeToMouseEvents(MouseListener mouseListener) {
  mouseListeners.remove(mouseListener);
}
void mousePressed() {
  for(int i = 0; i < mouseListeners.size(); i++) {
    MouseListener mouseListener = mouseListeners.get(i);
    if(mouseListener.mousePressed()) break;
  }
}
void mouseReleased() {
  for(int i = 0; i < mouseListeners.size(); i++) {
    MouseListener mouseListener = mouseListeners.get(i);
    if(mouseListener.mouseReleased()) break;
  }
}

interface MouseListener {
  boolean mouseDragged();
  boolean mouseMoved();
  boolean mousePressed();
  boolean mouseReleased();
}

/*
-------------------------------------------------------------------------------
LIVELETTER CLASS
Draws an arbitrary shape using s-splines and morphs it into other shapes.
-------------------------------------------------------------------------------
*/
class LiveText {   
  private float[][] vertexs, birth;
  private float[] head, spine, birthForm, currentForm, morphingForm, finalForm, angles, anglesTarget;
  private float x, y, finalX, finalY, morphStart, morph_duration, fontWeight, fontSize, fontBaseline, currentScale, morphScale, targetScale;
  boolean morphing, lostForm;
  private int fontColor;
  
  public LiveText(float[][] vertexs, float x, float y, int fontColor, float fontWeight, float fontSize, float fontBaseline) {
    this.x = this.finalX = x;
    this.y = this.finalY = y;
    this.fontColor = fontColor;
    this.fontWeight = fontWeight;
    this.fontSize = fontSize;
    this.fontBaseline = fontBaseline;
    currentScale = morphScale = targetScale = 1;
    morphing = lostForm = false;
    
    cleanup(vertexs);
    
    head = new float[vertexs[0].length];
    arrayCopy(vertexs[0], head);
    
    spine = new float[vertexs.length-1];
    birthForm = new float[spine.length];
    currentForm = new float[spine.length];
    morphingForm =  new float[spine.length];
    finalForm = new float[spine.length];
    
    for(int i=0; i<spine.length; i++) {
      spine[i] = dist(vertexs[i][0], vertexs[i][1], vertexs[i+1][0], vertexs[i+1][1]);
      birthForm[i] = atan2(vertexs[i+1][1]-vertexs[i][1], vertexs[i+1][0]-vertexs[i][0]);
      arrayCopy(birthForm, currentForm);
      arrayCopy(birthForm, morphingForm);
      arrayCopy(birthForm, finalForm);     
    }
    
    generateNewForm(true);
  }
  
  private void cleanup(float[][] vertexs) { 
    //Normalize;
    float smallestX = 1/0;
    float smallestY = 1/0;
    float biggestX = -1/0;
    float biggestY = -1/0;
    for(int i=0; i<vertexs.length; i++) {
      smallestX = (vertexs[i][0] < smallestX) ? vertexs[i][0] : smallestX;
      smallestY = (vertexs[i][1] < smallestY) ? vertexs[i][1] : smallestY;
      biggestX = (vertexs[i][0] > biggestX) ? vertexs[i][0] : biggestX;
      biggestY = (vertexs[i][1] > biggestY) ? vertexs[i][1] : biggestY;
    }
    for(int i=0; i<vertexs.length; i++) {
      vertexs[i][0] = map(vertexs[i][0], smallestX, biggestX, 0.0, 1.0);
      vertexs[i][1] = map(vertexs[i][1], smallestY, biggestY, 0, 1);
    }
    
    //Resize and translate;
    float fontWidth = fontSize * (biggestX-smallestX) / (biggestY-smallestY);
    for(int i=0; i<vertexs.length; i++) {
      vertexs[i][0] = x + (vertexs[i][0] * fontWidth);
      vertexs[i][1] = y - (fontSize * fontBaseline) + (vertexs[i][1] * fontSize);
    }
    
  }
  
  public void morph() {
    if(!morphing) {
      morphing = true;
      morphStart = millis();     
    } else {
      float time = millis()-morphStart;
      
      morphScale = easeOutQuad(time, currentScale, targetScale-currentScale, morph_duration);
      
      //HEAD
      head[0] = easeOutQuad(time, x, finalX-x, morph_duration);
      head[1] = easeOutQuad(time, y, finalY-y, morph_duration);
      
      //SPINE
      for(int i=0; i<currentForm.length; i++) {      
         morphingForm[i] = easeOutQuad(time, currentForm[i], finalForm[i], morph_duration);
      }
      
       if(time >= morph_duration) {
       morphing = false;
         x = finalX;
         y = finalY;
         currentScale = targetScale;
         for(int i=0; i<currentForm.length; i++) {
           currentForm[i] += finalForm[i];
           morphingForm[i] = currentForm[i] = currentForm[i] % TWO_PI;
         }
         generateNewForm(false);
       }
      
    }
  }
  
  public void restore() {
    for(int i=0; i<finalForm.length; i++) {
       finalForm[i] = birthForm[i] - currentForm[i];
    }
    targetScale = 1;
    lostForm = false;
  }
  
  private void generateNewForm(boolean disableRestore) {
    finalX = constrain(x+random(-LIVETEXT_MAX_MOVING_DISTANCE, LIVETEXT_MAX_MOVING_DISTANCE), 0, width);
    finalY = constrain(y+random(-LIVETEXT_MAX_MOVING_DISTANCE, LIVETEXT_MAX_MOVING_DISTANCE), 0, height);
    
    morph_duration = dist(finalX, finalY, x, y) / LIVETEXT_MORPH_SPEED * 1000;
    targetScale = constrain(currentScale + random(-2, 2), 1, 3);
    
    Boolean doRestore = (random(10) > 9) ? true : false;
    if(doRestore && !disableRestore) {
      restore();
    } else {
      for(int i=0; i<finalForm.length; i++) {
         finalForm[i] = radians(random(-LIVETEXT_MAX_TWISTING_ANGLE, LIVETEXT_MAX_TWISTING_ANGLE));
      }
    }
  }
  
  private float[] getSpineNodePosition(float distance, float angle, float previousNodeX, float previousNodeY) {
    float[] newPos = { cos(angle) * distance * morphScale + previousNodeX, sin(angle) * distance * morphScale + previousNodeY };
    return newPos;
  }
  
  public void draw() {
    noFill();
    stroke(fontColor);
    strokeWeight(fontWeight);
    if(!lostForm) {
      if(random(100) <= LIVETEXT_CHANCE_TO_LOOSE_ORIGINAL_FORM) lostForm = true;
    } else {
      morph();
    }
    beginShape();
    
    //HEAD
    curveVertex(head[0], head[1]);
    curveVertex(head[0], head[1]);
    
    //SPINE
    float[] position = { head[0], head[1] };
    for(int i=0; i<morphingForm.length; i++) {
      position = getSpineNodePosition(spine[i], morphingForm[i], position[0], position[1]);
      curveVertex( position[0], position[1] );
      if(i == morphingForm.length-1) { //TAIL
        curveVertex( position[0], position[1] );
      }
    }
    
    endShape();
  }
}

/*
-------------------------------------------------------------------------------
HANDDRAWNLIVE CLASS
Draws an arbitrary shape using s-splines and morphs it into other shapes.
-------------------------------------------------------------------------------
*/
public class HandDrawnLine implements MouseListener {
  private int colour;
  private float lineWeight;
  private float angle;
  private PVector startPoint, endPoint;
  private float[][] linePoints;
  private boolean vertical;
  private boolean interactive;
  private boolean interacting;
  private boolean animating;
  private float animationStartingTime, animationStartingX, animationStartingY;
  private float animationDuration;
  private float animationChangeX;
  private float animationChangeY;

  public HandDrawnLine(int colour, float strokeWeight, float x0, float y0, float x1, float y1, boolean vertical, boolean interactive) {
    this.colour = colour;
    this. lineWeight = strokeWeight;
    this.angle = atan2(y1-y0, x1-x0);
    this.vertical = vertical;
    this.interactive = interactive;
    this.interacting = false;
    this.animating = false;
    startPoint = new PVector(x0, y0, 0);
    endPoint = new PVector(x1, y1, 0);
    setLinePoints();
    subscribeToMouseEvents(this);
  }

  public void setLinePoints() {
    float lineNoise = random(10);
    float pointSpacing = dist(startPoint.x, startPoint.y, endPoint.x, endPoint.y) / NOTEBOOK_LINE_NUMBER_OF_VERTEXS;
    linePoints = new float[NOTEBOOK_LINE_NUMBER_OF_VERTEXS+1][2];
    for (int i=0; i<linePoints.length; i++) {
      float newX = cos(angle) * (i*pointSpacing) + startPoint.x;
      float newY = sin(angle) * (i*pointSpacing) + startPoint.y;
      if(vertical) {
        newX += noise(lineNoise) * NOTEBOOK_LINE_MAX_YPOSITION_VARIATION;
      } else {
        newY += noise(lineNoise) * NOTEBOOK_LINE_MAX_YPOSITION_VARIATION;
      }
      linePoints[i] = new float[] { newX, newY };
      lineNoise += 0.1;
    }
    angle = atan2(linePoints[linePoints.length-1][1]-startPoint.y, linePoints[linePoints.length-1][0]-startPoint.x);
  }

  public void draw() {
    strokeWeight(lineWeight); 
    smooth();
    noFill();
    stroke(colour); 
    
    beginShape(); 
    if(interacting) {
      curveVertex(linePoints[0][0], linePoints[0][1]);
      curveVertex(linePoints[0][0], linePoints[0][1]);
      curveVertex(mouseX, mouseY);
      curveVertex(linePoints[linePoints.length-1][0], linePoints[linePoints.length-1][1]);
      curveVertex(linePoints[linePoints.length-1][0], linePoints[linePoints.length-1][1]);
    }
    else {
      if(animating) {
        float pivotX = easeOutElastic(millis()-animationStartingTime, animationStartingX, animationChangeX, animationDuration);
        float pivotY = easeOutElastic(millis()-animationStartingTime, animationStartingY, animationChangeY, animationDuration);
        curveVertex(linePoints[0][0], linePoints[0][1]);
        curveVertex(linePoints[0][0], linePoints[0][1]);
        curveVertex(pivotX, pivotY);
        curveVertex(linePoints[linePoints.length-1][0], linePoints[linePoints.length-1][1]);
        curveVertex(linePoints[linePoints.length-1][0], linePoints[linePoints.length-1][1]);
        
        if(millis()-animationStartingTime >= animationDuration) animating = false;
      }
      for (int i=0; i<linePoints.length; i++) {
        vertex(linePoints[i][0], linePoints[i][1]);
      }
    }
    endShape();
  }
  
  public boolean hitTest(float x, float y, float strokeWeight) {
    float segmentLength = 1 / cos(angle) * abs(x-startPoint.x);
    float expectedY = sin(angle) * segmentLength + startPoint.y;
    if(y >= expectedY-strokeWeight && y <= expectedY+strokeWeight) return true;
    return false;
  }
  
  boolean mouseDragged() { return false; }
  boolean mouseMoved() { return false; }
  boolean mousePressed() {
    if(interactive && !animating) {
      interacting = hitTest(mouseX, mouseY, NOTEBOOK_LINE_HIT_RADIUS);
      boolean stopPropagation = interacting;
      return stopPropagation;
    }
    return false;
  }
  boolean mouseReleased() {
    if(interactive) {
      if(interacting) {
        float midPointX = (linePoints[linePoints.length-1][0]-linePoints[0][0]) / 2 + linePoints[0][0];
        float midPointY = (linePoints[linePoints.length-1][1]-linePoints[0][1]) / 2 + linePoints[0][1];
        animationStartingX = mouseX;
        animationStartingY = mouseY;
        animationChangeX = midPointX - animationStartingX;
        animationChangeY = midPointY - animationStartingY;
        animating = true;
        animationStartingTime = millis();
        animationDuration = dist(animationStartingX, animationStartingY, midPointX, midPointY) / NOTEBOOK_LINE_RELEASE_SPEED;
      }
      interacting = false;
      boolean stopPropagation = interacting;
      return stopPropagation;
    }
    return false;
  }
  
  float[] getPositionAt(float ratio) {
    ratio = constrain(ratio, 0, 1);
    float totalDistance = dist(startPoint.x, startPoint.y, endPoint.x, endPoint.y) * ratio;
    float currentPoint = round(map(ratio, 0, 1, 0, linePoints.length-1));
    float newY = linePoints[currentPoint][1];
    float[] p = { cos(angle) * totalDistance + startPoint.x, newY, angle };
    return p;
  }
  
}

/*
-------------------------------------------------------------------------------
NOTEBOOKPAGE CLASS
Draws an arbitrary shape using s-splines and morphs it into other shapes.
-------------------------------------------------------------------------------
*/
public class NotebookPage {  
  int numberOfLines;
  float lineSpacing;
  HandDrawnLine[] lines;
  StickMan stickMan;
  PImage[] textLines;
  PImage paperbg;
  
  LiveText conclua;
  float[][] concluaPath = {{33,105}, {7,122}, {0,154}, {14,161}, {47,161}, {90,131}, {92,141}, {94,164}, {119,164}, {142,145}, {150,121}, {130,108}, {120,115}, {128,122}, {167,117}, {182,118}, {188,147}, {193,147}, {214,128}, {235,121}, {244,130}, {244,148}, {257,159}, {277,155}, {286,137}, {304,122}, {322,114}, {304,125}, {287,139}, {284,158}, {312,165}, {337,151}, {363,128}, {390,89}, {406,63}, {419,43}, {426,13}, {416,0}, {397,20}, {385,47}, {374,86}, {368,119}, {370,151}, {395,166}, {420,152}, {434,131}, {444,109}, {444,109}, {438,141}, {445,159}, {461,157}, {480,144}, {495,127}, {497,129}, {494,151}, {502,167}, {518,156}, {540,133}, {558,115}, {585,109}, {619,106}, {620,108}, {586,111}, {564,130}, {561,154}, {579,157}, {608,144}, {627,123}, {628,124}, {635,148}, {646,163}, {681,176}};
  
  public NotebookPage(int numberOfLines) {
    paperbg = loadImage("paper_background.jpg");
    
    textLines = new PImage[3];
    for(int i = 0; i < textLines.length; i++) {
      textLines[i] = loadImage("line_"+i+".png");
    }
    
    this.numberOfLines = numberOfLines;
    this.lineSpacing = (float)height / (numberOfLines+1);
    
    lines = new HandDrawnLine[numberOfLines+1]; //First one is the pink line;
    float x0 = NOTEBOOK_LEFT_MARGIN + random(-NOTEBOOK_LINE_MAX_YPOSITION_VARIATION, NOTEBOOK_LINE_MAX_YPOSITION_VARIATION);
    float y0 = 0;
    float x1 = NOTEBOOK_LEFT_MARGIN + random(-NOTEBOOK_LINE_MAX_YPOSITION_VARIATION, NOTEBOOK_LINE_MAX_YPOSITION_VARIATION);
    float y1 = height;
    lines[0] = new HandDrawnLine(NOTEBOOK_MARGIN_COLOR, 2, x0, y0, x1, y1, true, false);
    
    for(int i=1; i<=numberOfLines; i++) {
      x0 = 0;
      y0 = i*lineSpacing + random(-NOTEBOOK_LINE_MAX_YPOSITION_VARIATION, NOTEBOOK_LINE_MAX_YPOSITION_VARIATION);
      x1 = width;
      y1 = i*lineSpacing + random(-NOTEBOOK_LINE_MAX_YPOSITION_VARIATION, NOTEBOOK_LINE_MAX_YPOSITION_VARIATION);
      boolean hasText = (i>NOTEBOOK_TEXT_STARTING_LINE && i<=NOTEBOOK_TEXT_STARTING_LINE+textLines.length) ? false : true;
      lines[i] = new HandDrawnLine(NOTEBOOK_LINE_COLOR, 2, x0, y0, x1, y1, false, hasText);
    }
    
    float concluaPos = lines[NOTEBOOK_TEXT_STARTING_LINE+textLines.length].getPositionAt(0.14);
    conclua =  new LiveText(concluaPath, concluaPos[0], concluaPos[1], LIVETEXT_FONT_COLOR, LIVETEXT_FONT_WEIGHT, LIVETEXT_FONT_SIZE, LIVETEXT_FONT_BASELINE);
    stickMan = new StickMan(lines[round(random(1, numberOfLines-1))]);  
  }
  
  public void draw() {
    imageMode(CORNER);
    image(paperbg, 0, 0);
    
    for(int i=0; i<lines.length; i++) {
      lines[i].draw();
    }
    
    //Text
    for(int i=0; i<textLines.length; i++) {
      float[] textPos = lines[i+1+NOTEBOOK_TEXT_STARTING_LINE].getPositionAt(0.1);
      imageMode(CORNER);
      pushMatrix();
        translate(textPos[0], textPos[1]-20);
        rotate(textPos[2]);
        image(textLines[i], 0, 0);
      popMatrix();
    }
    
    conclua.draw();    
    stickMan.draw();
  }
}

/*
-------------------------------------------------------------------------------
STICKMAN CLASS
Draws an arbitrary shape using s-splines and morphs it into other shapes.
-------------------------------------------------------------------------------
*/
public class StickMan {
  private HandDrawnLine parentLine;
  private PImage[] walkingSprites;
  private int walkingCycle = 0;
  private int stickmanH, stickmanW;
  private float dir = 0;
  private float increment = 0.001;
  private float lastCycle, cycleDuration;
  
  public StickMan(HandDrawnLine parentLine) {
    
    this.parentLine = parentLine;
    walkingSprites = new PImage[3];
    walkingSprites[0] = loadImage("stickman_walking_0.png");
    walkingSprites[1] = loadImage("stickman_walking_1.png");
    walkingSprites[2] = loadImage("stickman_walking_2.png");
    
    stickmanW = walkingSprites[0].width;
    stickmanH = walkingSprites[0].height;
    
    lastCycle = millis();
    cycleDuration = 300;
  }
  
  public void draw() {
    float position = parentLine.getPositionAt(dir);
    imageMode(CENTER);
    pushMatrix();
      translate(position[0], position[1]-stickmanH/2+4);
      if(increment < 0) scale(-1.0, 1.0);
      rotate(position[2]);
      image(walkingSprites[walkingCycle], 0, 0);
    popMatrix();
    
    dir += increment;
    if(dir > 1 || dir < 0) {
      increment *= -1;
    } else {
      if(random(200) <= 1) increment *= -1;
    }
    if( millis() - lastCycle >= cycleDuration) {
      lastCycle = millis();
      walkingCycle = (walkingCycle + 1) % walkingSprites.length;
    }
  }
  
}
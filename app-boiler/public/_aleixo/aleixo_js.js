/* @pjs font="Darkheart-Regular-48.vlw"; */

ArrayList<MouseListener> mouseListeners;
/**
 * Loop. 
 * 
 * Shows how to load and play a QuickTime movie file.  
 *
 */
//PFont f;
char letterCase = '1';
Canvas1 cv1;
Canvas2 cv2;
Canvas3 cv3;
Canvas4 cv4;
Canvas5 cv5;
Canvas6 cv6;
Canvas7 cv7;

void setup() {

    mouseListeners = new ArrayList<MouseListener>();

    size(768, 1024,P2D);
  background(0);
//
  cv1 = new Canvas1();
  cv2 = new Canvas2();
  cv3 = new Canvas3();
  cv4 = new Canvas4();
  cv5 = new Canvas5();
  cv6 = new Canvas6();
  cv7 = new Canvas7();

  
  initTexto();
  
}


void draw() {
  
  drawingCase();
  showText(getPoema(), width/2, height/2, 70);
//  drawing();
  
}



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


void drawing() {


  if (frameCount%300 < 100) {
    //    image(movie, 0, 0, width, height);
    cv1.draw();
  }

  else if (frameCount%120 > 90 ) {
    cv2.draw();
  }
  else {
    cv3.draw();
  }
}

void drawingCase() {



  switch(letterCase) {
  case '1': 
    cv1.draw();
    break;
  case '2': 
    cv2.draw();
    break;
  case '3': 
    cv3.draw();
    break;
      case '4': 
    cv4.draw();
    break;
      case '5': 
    cv5.draw();
    break;
      case '6': 
    cv6.draw();
    break;
      case '7': 
    cv7.draw();
    break;
  default:
    cv1.draw();
break;
  }
}

void mouseClicked(){
//  cv7.mouseClicked();

}


void mouseReleased() {
  
}


void keyPressed() {


  if (key == '1') {
    cv1.setup();
    letterCase = '1';
    
    
  } 
  else if (key == '2') {
    cv2.setup();
    letterCase = '2';
    
  }
  else if (key == '3') {
    cv3.setup();
    letterCase = '3';
    
  }
  else if (key == '4') {
    cv4.setup();
    letterCase = '4';
    
  }
    else if (key == '5') {
      cv5.setup();
    letterCase = '5';
    
  }
    else if (key == '6') {
      cv6.setup();
    letterCase = '6';
    
  }
    else if (key == '7') {
      cv7.setup();
    letterCase = '7';
    
  }
  else {
    cv1.setup();
    letterCase = '1';
    
  }
} 

String[] getPoema() {
  if (frameCount%60 < 20) {
    return poesias[0];
  }

  else if (frameCount%60 > 40 ) {
    return poesias[1];
  }
  else {
    return poesias[2];
  }
}

class Canvas1{
 PGraphics pg;

  Canvas1(){
  this.setup();
};
  
float inc = 0.06;
int density = 20;
float znoise = 0.0;

void setup(){
  pg = createGraphics(width,height);
  background(0);
};
void draw(){
 pg.beginDraw();
 {
   
  float xnoise = 0.0;
  float ynoise = 0.0;
  for (int y = 0; y < height; y += density) {
    for (int x = 0; x < width; x += density) {
      float n = noise(xnoise, ynoise, znoise) * 256;
      pg.fill(n);
//      rectMode(CORNER);
      pg.rect(x, y, density, density);
      xnoise += inc;
    }
    xnoise = 0;
    ynoise += inc;
  }
  znoise += inc;
  pg.endDraw();
}
  image(pg,0,0);
  
}

}
class Canvas2{
PGraphics pg;  
  Canvas2(){
        pg = createGraphics(width,height);
        this.setup();
    };
float angle = 0.0; // Changing angle
float speed = 0.05; // Speed of growth

void setup(){

background(0);
};

void draw() {
  pg.beginDraw();
  pg.background(0);
  
  circlePhase(0.0);
  circlePhase(QUARTER_PI);
  circlePhase(HALF_PI);
  angle += speed;
  pg.endDraw();
  image(pg,0,0);
}
void circlePhase(float phase) {
  float diameter = 200 + (sin(angle + phase) * 45);
  pg.fill(255,0,0);
  pg.ellipse(width/2, height/2, diameter, diameter);
//  noFill();
}
}

class Canvas3{
  
  PGraphics pg;
  
  float number = 1;
float last,last2;
float[] fibs= new float [1];
 
float px,py,r,degree;
float[] xpos = new float[0];
float[] ypos = new float[0];
 
float spacing = 6;
int startWeight = 2;
int maxWeight = 5;
float weight = startWeight;
float guldenSnede = ((sqrt(5) - 1 ) / 2);
 
float lastX, lastY;
  
  Canvas3(){
    pg = createGraphics(width,height);
    this.setup();
  };

 
void setup()
{
//  size(1280, 800);
  background(255);
  
//  frameRate(30);
  px = width/2;
  py = height/2;
}
 
void draw()
{
    pg.beginDraw();
    pg.smooth();
  pg.stroke(0);
    lastX = px;
    lastY = py;
    degree = (frameCount * guldenSnede) * 360;
    r = sqrt(frameCount)*spacing;
    calculatePoint(width/2, height/2, r, (degree % 360));
    pg.strokeWeight(weight);
    pg.point(px,py);
    //line(lastX, lastY, px,py);
    weight += 0.00015;
    
    //spacing += 0.00075;
    pg.endDraw();
    image(pg,0,0);
}
 
void calculatePoint(float x, float y, float r, float graden){
  px = x + cos(radians(graden))*(r/2);
  py = y + sin(radians(graden))*(r/2);
}
}
class Canvas4{
  PGraphics pg;
  Canvas4(){
    pg = createGraphics(width,height);
  this.setup();
  };
/* OpenProcessing Tweak of *@*http://www.openprocessing.org/sketch/151109*@* */
/* !do not delete the line above, required for linking your tweak if you upload again */
int fc, num = 180, edge = 200;
ArrayList ballCollection;
boolean save = false;
 
void setup() {
//  size(800, 600);
  pg.background(0);
  ballCollection = new ArrayList();
  createStuff();
}
 
void draw() {
  pg.beginDraw();
  pg.background(0);
  pg.fill(0,20);
  pg.noStroke();
  pg.rect(0,0,width,height);
   
  for (int i=0; i<ballCollection.size(); i++) {
    Ball mb = (Ball) ballCollection.get(i);
    mb.run();
  }
 
  if (save) {
//    if (frameCount%1==0 && frameCount < fc + (240*3)) saveFrame("image-####.tif");
  }
  pg.endDraw();
  image(pg,0,0);
}
 
void keyPressed() {
  fc = frameCount;
//  save = true;
}
 
void mouseReleased() {
  pg.background(0);
  createStuff();
}
 
void createStuff() {
  ballCollection.clear();
  for (int i=0; i<num; i++) {
    PVector org = new PVector(random(edge, width-edge), random(edge, height-edge));
    float radius = random(50, 150);
    PVector loc = new PVector(org.x+radius, org.y);
    float offSet = random(TWO_PI);
    int dir = 1;
    float r = random(1);
    if (r>.5) dir =-1;
    Ball myBall = new Ball(org, loc, radius, dir, offSet);
    ballCollection.add(myBall);
  }
}
class Ball {
 
  PVector org, loc;
  float sz = 10;
  float theta, radius, offSet;
  int s, dir, d = 60;
 
  Ball(PVector _org, PVector _loc, float _radius, int _dir, float _offSet) {
    org = _org;
    loc = _loc;
    radius = _radius;
    dir = _dir;
    offSet = _offSet;
  }
 
  void run() {
    move();
    display();
    lineBetween();
  }
 
  void move() {
    loc.x = org.x + sin(theta+offSet)*radius;
    loc.y = org.y + cos(theta+offSet)*radius;
    theta += (0.0523/2*dir);
  }
 
  void lineBetween() {
    for (int i=0; i<ballCollection.size(); i++) {
      Ball other = (Ball) ballCollection.get(i);
      float distance = loc.dist(other.loc);
      if (distance >0 && distance < d) {
        pg.stroke(#ffffff,150);
        pg.line(loc.x, loc.y, other.loc.x, other.loc.y);       
      }
    }
  }
 
  void display() {
    pg.noStroke();
    for (int i=0; i<10; i++) {
      pg.fill(255, i*50);
      pg.ellipse(loc.x, loc.y, sz-2*i, sz-2*i);
    }
  }
}


}

class Canvas5{
  
  PGraphics pg;

int numRect = 10;
int[]rectX = new int[numRect];
int[]rectY = new int[numRect];
 
 
int rectW = 80;
int rectH = 80;
float t;
float tra;
float trb;
float easing =0.5;
 
 Canvas5(){
   pg =  createGraphics(width,height);
   this.setup();
   
 };
 
void setup() {
//  size(800, 800);
  int step = rectW;
  int step2 = 30;
  for (int i = 0; i < numRect - 1; i ++) {
    rectX[i] = step -width;
    rectY[i] = step -height;
 
    step = step + rectW * 2;
  }
}
 
 
void draw() {
  pg.beginDraw();
  pg.background(255);
  pg.fill(0);
  pg.noStroke();
  pg.rectMode(CENTER);
  pg.translate(width/2, height/2);
  //scale(0.2);
  float m = millis()*0.001;
  float deg = sin(m);
  float degree = map(deg, -1, 1, -HALF_PI, HALF_PI);
  float dega = cos(2*m);
 
  pg.rotate(degree);
  
  
 
  //rotate(degree);
  //translate(width/2,height/2);
 
 
  for (int i = 0; i < numRect - 1; i ++) {
    t= map(dega, -1, 1, 80, 50);
    for (int j = 0; j < numRect - 1; j ++) {
      tra= map(dega, -1, 1, 80, 50);
      pg.fill(0);
      pg.rect(rectX[i], rectY[j], t, tra);
 
      
    }
  }
 
  pg.rotate(-degree*2);
  for (int i = 0; i < numRect - 1; i ++) {
 
    for (int j = 0; j < numRect - 1; j ++) {
      pg.fill(0);
      pg.ellipse(rectX[i], rectY[j], 20, 20);
      pg.fill(255);
      float size = map(t, 80, 50, 20, 0);
      pg.ellipse(rectX[i], rectY[j], size, size);
      
    }
  }
pg.endDraw();
image(pg,0,0);
}

}
class Canvas6{
  PGraphics pg;
  Canvas6(){
    pg=createGraphics(width,height);
    this.setup();
  };

void setup() {
  
  pg.stroke(255);
  pg.colorMode(RGB,100);
//  pg.background(0);
}
 
int fib(int n) {
  if(n <= 0) {
    return 0;
  }
  if(n == 1) {
    return 1;
  }
  return fib(n-2)+fib(n-1);
}
 
void strokeFib(int n) {
  for(int i = 0 ; i < n ; i++) {
    int fx = fib(i);
    pg.stroke(100,100,100,10);
    pg.line(0, 0, fx, 0);
    pg.translate(fx,0);
    pg.rotate(PI*.5);
  }
}
 
void draw() {
    pg.beginDraw();
    pg.translate(width/2,height/2);
    pg.rotate(frameCount/TWO_PI);
    strokeFib(20);
    pg.endDraw();  
    image(pg,0,0);
  
}
}
class Canvas7{
  PGraphics pg;
  
  Canvas7(){
  pg = createGraphics(width, height);
  this.setup();
};
  
void setup() {
//  size(400,400);
  pg.colorMode(HSB,100);
  pg.stroke(0,0,100,1);
//  pg.background(0);
   
}
 
void trace(int n) {
  for(int i = 0 ; i < n ; i++) {
    int fx = i*5;
    pg.line(0, 0, fx, 0);
    pg.translate(fx,0);
    pg.rotate(noise(n)*TWO_PI);
  }
}
 
void draw() {
  pg.beginDraw();
  pg.translate(width/2,height/2);
  trace(500);
  pg.endDraw();
  image(pg,0,0);
}
 
void mouseClicked() {
//  pg.background(0);
  noiseSeed((int) random(2<<030) * second());
}

}

String[][] poesias = {
                     {    
    "o tempo todo tudo muda",
    "muda o tempo todo tudo",
    "todo tudo muda o tempo",
    "todo o tempo muda tudo",
    "todo tudo o tempo muda",
    "tudo o tempo muda todo",
    "muda o todo tudo tempo",
    "muda todo o tempo tudo"
                     },
                     {
    "muda todo tudo o tempo",
    "o tempo tudo muda todo",
    "todo o tempo tudo muda",
    "tempo o todo muda tudo",
    "tudo todo o tempo muda",
    "muda o tudo todo tempo",
    "o tempo muda todo tudo",
    "muda o tempo tudo todo"
  },
  {
    "tudo muda todo o tempo",
    "o tempo todo muda tudo",
    "tudo todo o tempo muda",
    "muda tudo o tempo todo",
    "muda tudo todo o tempo",
    "tudo muda o tempo todo",
    "tempo o todo tudo muda",
    "tudo o tempo todo muda"
  }

                       
                       
};




////AffluentDemibold-48
PFont boo;
//ArrayList <PFont> fonts;
////PFont mono;
//// The font "AndaleMono-48.vlw"" must be located in the 
//// current sketch's "data" directory to load successfully
////mono = loadFont("AndaleMono-32.vlw");
//background(0);
//textFont(mono);
//text("word", 12, 60);
//
//


void initTexto() {

//  fonts = new ArrayList<PFont>();
//boo =  loadFont("DFWaWaSC-W5-48.vlw");
//boo =  loadFont("Darkheart-Regular-48.vlw");
textFont(createFont("Darkheart-Regular-48",48));
//  fonts.add(loadFont("DFWaWaSC-W5-48.vlw"));
//  fonts.add(loadFont("Darkheart-Regular-48.vlw"));
//  fonts.add(loadFont("YuGo-Medium-48.vlw"));



//  //  PFont font = fonts.get(0); 
  //  printArray(PFont.list());
  //  f = createFont("Georgia", 24);
}


void showText(String[] poema, int x, int y, int tSize) {
  if (letterCase == ('3') || letterCase == '5'){
    fill(0);
  }
 else{
   fill(255);
 } 
  
  int ySize = y;

  textSize(tSize);
  textAlign(CENTER);
  
//  fill(255);
  text(poema[0].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[1].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[2].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[3].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[4].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[5].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[6].toUpperCase(), x, ySize);
  ySize += tSize/1.61;
  text(poema[7].toUpperCase(), x, ySize);
}










/////

void showTextCursor(JSONObject poema, int x, int y, int tSize, PFont boo) {
  if (letterCase == '3'){
    fill(0);
  }
 else{
   fill(255);
 } 
  
  pushMatrix();
  char[] letters;
  float totalOffset = 0;
  letters = poema.getString("verso1").toCharArray();

  int ySize = y;

  //  translate((width - totalOffset) / 2, 0);
  totalOffset = 0;
  float firstWidth = (width / letters.length) / 4.0;
  //  translate(firstWidth, 0);
  //  translate(0, 0);
  for (int i = 0; i < letters.length; i++) {
    float distance = abs(totalOffset - mouseX);
    distance = constrain(distance, 24, 60);
    textSize(84 - distance);
    

    text(letters[i], x, ySize);




    float letterWidth = textWidth(letters[i]);
    if (i != letters.length - 1) {
      totalOffset = totalOffset + letterWidth;
      translate(letterWidth, 0);
    }
  }
  popMatrix();

//  textFont(fonts.get(1));
//  fill(255);
  //  text(poema.getString("verso1").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso2").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso3").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso4").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso5").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso6").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso7").toUpperCase(), x, ySize);
  ySize += tSize;
  text(poema.getString("verso8").toUpperCase(), x, ySize);


  //  translate(0, 0);
  //  textSize(tSize);
  ////  textAlign(RIGHT);
  //  textFont(fonts.get(1));
  //  fill(255);
  ////  text(poema.getString("verso1").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso2").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso3").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso4").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso5").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso6").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso7").toUpperCase(), x, ySize);
  //  ySize += tSize;
  //  text(poema.getString("verso8").toUpperCase(), x, ySize);
}




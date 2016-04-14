package algorithm;

class Point {
	private double x,y;
	
	Point(double x, double y){
		this.setX(x);
		this.setY(y);
	}

	double getX() {
		return x;
	}

	void setX(double x) {
		this.x = x;
	}

	double getY() {
		return y;
	}

	void setY(double y) {
		this.y = y;
	}
	
	boolean equalsPoint(Point otherPoint){
		if(x == otherPoint.getX() && y == otherPoint.getY()){
			return true;
		}
		else{
			return false;
		}
	}
	
	boolean equalsPoint(int x, int y){
		if(this.x == x && this.y == y){
			return true;
		}
		else{
			return false;
		}
	}
	
	double squaredDistanceToPoint(Point otherPoint){
		double xDistance = (x - otherPoint.getX());
		double yDistance = (y - otherPoint.getY());
		double squaredDistance = (xDistance * xDistance) + (yDistance * yDistance);
		
		return squaredDistance;
	}
}

package algorithm;

public class Point {
	private double x,y;
	
	public Point(double x, double y){
		this.setX(x);
		this.setY(y);
	}

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}
	
	public boolean equalsPoint(Point otherPoint){
		if(x == otherPoint.getX() && y == otherPoint.getY()){
			return true;
		}
		else{
			return false;
		}
	}
	
	public boolean equalsPoint(int x, int y){
		if(this.x == x && this.y == y){
			return true;
		}
		else{
			return false;
		}
	}
	
	public double squaredDistanceToPoint(Point otherPoint){
		double xDistance = (x - otherPoint.getX());
		double yDistance = (y - otherPoint.getY());
		double squaredDistance = (xDistance * xDistance) + (yDistance * yDistance);
		
		return squaredDistance;
	}
	
	public String toString(){
		String toBeReturned = "(" + x + ", " + y + ")";
		return toBeReturned;
	}	
}

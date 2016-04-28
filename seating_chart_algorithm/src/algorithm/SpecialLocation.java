package algorithm;
import java.util.ArrayList;


class SpecialLocation {
	private String type;
	private int integerType;
	private Point point;
	private Employee pseudoEmployee;
	private Cluster pseudoCluster;
	private String stringIdentifier;
	ArrayList<Point> points;
	
	SpecialLocation(int type, Point point){
		integerType = type;
		switch(type){
		case 4: 
			this.type = "restroom";
			stringIdentifier = "R";
			break;
		case 5:
			this.type = "conference";
			stringIdentifier = "C";
			break;
		case 6:
			this.type = "airconditioner";
			stringIdentifier = "AC";
			break;
		case 7:
			this.type = "kitchen";
			stringIdentifier = "K";
			break;
		}
		this.point = point;
		pseudoCluster = new Cluster((int)point.getX(), (int)point.getY());
		points = new ArrayList<Point>();
		points.add(point);
	}
	
	SpecialLocation(String type){
		this.type = type;
	}
	
	void setType(String type){
		this.type = type;
	}
	
	String getStringIdentifier(){
		return stringIdentifier;
	}
	
	String getType(){
		return type;
	}
	
	void setPoint(Point point){
		this.point = point;
	}
	
	Point getPoint(){
		return point;
	}
	
	void createPseudoEmployee(int id, int spotInArray){
		pseudoEmployee = new Employee(id);
		pseudoEmployee.setSpotInArray(spotInArray);
		pseudoCluster.assignToDesk(pseudoEmployee);
	}
	
	double calculateSimilarity(int rating){
		return rating * 4.3;
	}
	
	void addPoint(Point point){
		points.add(point);
		pseudoCluster.addDesk(new Desk(point));
		pseudoCluster.setNumberOfDesks(1); //We always want it set to 1, because we needed it to be treated like a cluster with a single employee.
	}

	Cluster getPseudoCluster() {
		return pseudoCluster;
	}
	
	int getNumberOfPoints(){
		return points.size();
	}
	
	Point getPoint(int i){
		return points.get(i);
	}
	
	int getIntegerType(){
		return integerType;
	}
	
	boolean checkForPoint(Point p){
		for(int i = 0; i < points.size(); i++){
			if(points.get(i).equalsPoint(p)){
				return true;
			}
		}
		return false;
	}
	
	boolean sharesAPointWith(SpecialLocation other){
		for(int i = 0; i < points.size(); i++){
			for(int j = 0; j < other.getNumberOfPoints(); j++){
				if(points.get(i).equalsPoint(other.getPoint(j))){
					return true;
				}
			}
		}
		return false;
	}
}

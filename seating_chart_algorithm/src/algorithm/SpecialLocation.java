package algorithm;
import java.util.ArrayList;


public class SpecialLocation {
	private String type;
	private int integerType;
	private Point point;
	private Employee pseudoEmployee;
	private Cluster pseudoCluster;
	private String stringIdentifier;
	ArrayList<Point> points;
	
	public SpecialLocation(int type, Point point){
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
		}
		this.point = point;
		pseudoCluster = new Cluster((int)point.getX(), (int)point.getY());
		points = new ArrayList<Point>();
		points.add(point);
	}
	
	public SpecialLocation(String type){
		this.type = type;
	}
	
	public void setType(String type){
		this.type = type;
	}
	
	public String getStringIdentifier(){
		return stringIdentifier;
	}
	
	public String getType(){
		return type;
	}
	
	public void setPoint(Point point){
		this.point = point;
	}
	
	public Point getPoint(){
		return point;
	}
	
	public void createPseudoEmployee(int id){
		pseudoEmployee = new Employee(id);
		//What are the characteristics of our new employee?
		//
		//
		pseudoCluster.assignToDesk(pseudoEmployee);
	}
	
	public void addPoint(Point point){
		points.add(point);
		pseudoCluster.addDesk(new Desk(point));
		pseudoCluster.setNumberOfDesks(1); //We always want it set to 1, because we needed it to be treated like a cluster with a single employee.
	}

	public Cluster getPseudoCluster() {
		return pseudoCluster;
	}
	
	public int getNumberOfPoints(){
		return points.size();
	}
	
	public Point getPoint(int i){
		return points.get(i);
	}
	
	public int getIntegerType(){
		return integerType;
	}
	
	public boolean checkForPoint(Point p){
		for(int i = 0; i < points.size(); i++){
			if(points.get(i).equalsPoint(p)){
				return true;
			}
		}
		return false;
	}
	
	public boolean sharesAPointWith(SpecialLocation other){
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

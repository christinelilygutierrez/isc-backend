package algorithm;
import java.util.ArrayList;

class Cluster {
	private ArrayList<Desk> desks;
	private int numberOfDesks;
	private Employee pairedEmployee1;
	private Employee pairedEmployee2;
	private int openDesksRemaining;
	private Point middlePoint;
	private int numberOfEmployees;
	private boolean hasAPair;
	private double restroomScore;
	
	Cluster(int x, int y){
		desks = new ArrayList<Desk>();
		Desk d = new Desk(x, y);
		this.addDesk(d);
		openDesksRemaining = 1;
		middlePoint = new Point(-1,-1);
		numberOfEmployees = 0;
		hasAPair = false;
		restroomScore = 0;
	}
	
	double getRestroomScore(){
		return restroomScore;
	}
	
	void setRestRoomScore(double score){
		restroomScore = score;
	}
	
	int getNumberOfEmployees(){
		return numberOfEmployees;
	}
	
	Employee getPairedEmployee1(){
		return pairedEmployee1;
	}
	
	Employee getPairedEmployee2(){
		return pairedEmployee2;
	}
	
	boolean hasBeenAssignedAPair(){
		return hasAPair;
	}
	
	void assignPairOfEmployees(Employee e1, Employee e2){
		pairedEmployee1 = e1;
		pairedEmployee2 = e2;
		assignToDesk(e1);
		assignToDesk(e2);
		
		e1.assigned();
		e2.assigned();
		hasAPair = true;
	}
	
	int getNumberOfDesks() {
		return numberOfDesks;
	}
	
	boolean onlyOneDesk(){
		if(numberOfDesks > 1){
			return false;
		}
		else{
			return true;
		}
	}

	void setNumberOfDesks(int numberOfDesks) {
		this.numberOfDesks = numberOfDesks;
	}
	
	void addDesk(Desk d){
		desks.add(d);
		numberOfDesks++;
	}
	
	void addDesk(int x, int y){
		desks.add(new Desk(x, y));
		numberOfDesks++;
		openDesksRemaining++;
	}
	
	Desk getDesk(int index){
		return desks.get(index);
	}
	
	Employee getEmployeeByIndex(int i){
		return desks.get(i).getEmployee();
	}
	
	Point getMiddle(){
		if(middlePoint.getX() == -1.0){
			computeMiddle();
		}
		
		return middlePoint;
	}
	
	void computeMiddle(){
		double xSum = 0;
		double ySum = 0;
		
		for(int i = 0; i < numberOfDesks; i++){
			xSum += desks.get(i).getPoint().getX();
			ySum += desks.get(i).getPoint().getY();
		}

		middlePoint = new Point((xSum/numberOfDesks), (ySum/numberOfDesks));
	}
	
	boolean wallBetween(Cluster otherCluster, ArrayList<Wall> walls){
		for(int i = 0; i < walls.size(); i++){
			if(walls.get(i).betweenClusters(this, otherCluster)){
				return true;
			}
		}
		return false;
	}
	
	boolean wallBetween(Point otherPoint, ArrayList<Wall> walls){
		for(int i = 0; i < walls.size(); i++){
			if(walls.get(i).betweenClusters(this, otherPoint)){
				return true;
			}
		}
		return false;
	}
	
	boolean checkForDesk(Desk d){
		for(int i = 0; i < desks.size(); i++){
			if(d.getPoint().equalsPoint(desks.get(i).getPoint()))
				return true;
		}
		return false;
	}
	
	boolean checkForDesk(int x, int y){
		for(int i = 0; i < desks.size(); i++){
			if(desks.get(i).getPoint().equalsPoint(x, y))
				return true;
		}
		return false;
	}
	
	//Returns true if the two clusters have at least one identical desk. Returns false, otherwise.
	boolean sharesADeskWith(Cluster other){ 
		for(int i = 0; i < numberOfDesks; i++){
			for(int j = 0; j < other.getNumberOfDesks(); j++){
				if(desks.get(i).getPoint().equalsPoint(other.getDesk(j).getPoint())){ //We've found a match.
					return true;
				}
			}
		}
		return false;
	}
	
	int getNumberOfOpenDesks(){
		return openDesksRemaining;
	}
	
	void fakeAPair(){
		hasAPair = true;
	}
	
	void assignToDesk(Employee e){
		int i = 0;
		while(i < numberOfDesks){
			if(desks.get(i).checkIfOpen()){
				desks.get(i).setEmployee(e);
				e.assigned();
				numberOfEmployees++;
				openDesksRemaining--;
				return;
			}
			i++;
		}
	}
}

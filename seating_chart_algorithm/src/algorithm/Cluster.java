package algorithm;
import java.util.ArrayList;


public class Cluster {
	private ArrayList<Desk> desks;
	private int numberOfDesks;
	private Employee pairedEmployee1;
	private Employee pairedEmployee2;
	private int openDesksRemaining;
	private Point middlePoint;
	private int numberOfEmployees;
	private boolean hasAPair;
	
	public Cluster(int x, int y){
		desks = new ArrayList<Desk>();
		Desk d = new Desk(x, y);
		this.addDesk(d);
		openDesksRemaining = 1;
		middlePoint = new Point(-1,-1);
		numberOfEmployees = 0;
		hasAPair = false;
	}
	
	public int getNumberOfEmployees(){
		return numberOfEmployees;
	}
	
	public Employee getPairedEmployee1(){
		return pairedEmployee1;
	}
	
	public Employee getPairedEmployee2(){
		return pairedEmployee2;
	}
	
	public boolean hasBeenAssignedAPair(){
		return hasAPair;
	}
	
	public void assignPairOfEmployees(Employee e1, Employee e2){
		pairedEmployee1 = e1;
		pairedEmployee2 = e2;
		assignToDesk(e1);
		assignToDesk(e2);
		
		//e1.setPartOfPair(true);
		//e2.setPartOfPair(true);
		e1.assigned();
		e2.assigned();
		hasAPair = true;
	}
	
	//Currently not being used:
	public void setPairedEmployee1(Employee e){
		pairedEmployee1 = e;
		//Assign this employee to a desk:
		assignToDesk(e);
	}
	
	//Currently not being used:
	public void setPairedEmployee2(Employee e){
		pairedEmployee2 = e;
		assignToDesk(e);
	}
	
	public void printPair(){
		System.out.println("Desks remaining: " + openDesksRemaining);
		System.out.println("Employee 1: " + pairedEmployee1.getID());
		System.out.println("Employee 2: " + pairedEmployee2.getID());
	}

	public int getNumberOfDesks() {
		return numberOfDesks;
	}
	
	public boolean onlyOneDesk(){
		if(numberOfDesks > 1){
			return false;
		}
		else{
			return true;
		}
	}

	public void setNumberOfDesks(int numberOfDesks) {
		this.numberOfDesks = numberOfDesks;
	}
	
	public void addDesk(Desk d){
		desks.add(d);
		numberOfDesks++;
	}
	
	public void addDesk(int x, int y){
		desks.add(new Desk(x, y));
		numberOfDesks++;
		openDesksRemaining++;
	}
	
	public Desk getDesk(int index){
		return desks.get(index);
	}
	
	public Employee getEmployeeByIndex(int i){
		return desks.get(i).getEmployee();
	}
	
	public Point getMiddle(){
		if(middlePoint.getX() == -1.0){
			computeMiddle();
		}
		
		return middlePoint;
	}
	
	public void computeMiddle(){
		double xSum = 0;
		double ySum = 0;
		
		for(int i = 0; i < numberOfDesks; i++){
			xSum += desks.get(i).getPoint().getX();
			ySum += desks.get(i).getPoint().getY();
		}

		middlePoint = new Point((xSum/numberOfDesks), (ySum/numberOfDesks));
	}
	
	public boolean wallBetween(Cluster otherCluster, ArrayList<Wall> walls){
		for(int i = 0; i < walls.size(); i++){
			if(walls.get(i).betweenClusters(this, otherCluster)){
				return true;
			}
		}
		return false;
	}
	
	public boolean checkForDesk(Desk d){
		for(int i = 0; i < desks.size(); i++){
			if(d.getPoint().equalsPoint(desks.get(i).getPoint()))
				return true;
		}
		return false;
	}
	
	public boolean checkForDesk(int x, int y){
		for(int i = 0; i < desks.size(); i++){
			if(desks.get(i).getPoint().equalsPoint(x, y))
				return true;
		}
		return false;
	}
	
	//Returns true if the two clusters have at least one identical desk. Returns false, otherwise.
	public boolean sharesADeskWith(Cluster other){ 
		for(int i = 0; i < numberOfDesks; i++){
			for(int j = 0; j < other.getNumberOfDesks(); j++){
				if(desks.get(i).getPoint().equalsPoint(other.getDesk(j).getPoint())){ //We've found a match.
					return true;
				}
			}
		}
		return false;
	}
	
	public int getNumberOfOpenDesks(){
		return openDesksRemaining;
	}
	
	public void assignToDesk(Employee e){
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

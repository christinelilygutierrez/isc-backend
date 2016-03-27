package algorithm;
import java.util.ArrayList;

public class Employee {
	private int id;
	private boolean partOfPair;
	private ArrayList<Characteristic> characteristics;
	private ArrayList<Employee> blacklist;
	private int spotInArray;
	private boolean waitingToBeAssigned;
	private double totalSimilarity; 
	
	public Employee(int idNum){
		id = idNum;
		characteristics = new ArrayList<Characteristic>();
		blacklist = new ArrayList<Employee>();
		partOfPair = false;
		waitingToBeAssigned = true;
		totalSimilarity = 0;
	}
	
	public int getID(){
		return id;
	}
	
	public boolean partOfPair(){
		return partOfPair;
	}
	
	public void setSpotInArray(int i){
		spotInArray = i;
	}
	
	public int getSpotInArray(){
		return spotInArray;
	}
	
	public double getTotalSimilarity(){
		return totalSimilarity;
	}
	
	public void addToTotalSimilarity(double d){
		totalSimilarity += d;
	}
	
	//Returns true if the employee needs to be assigned. False otherwise.
	public boolean waitingToBeAssigned(){
		return waitingToBeAssigned;
	}
	
	public void assigned(){
		waitingToBeAssigned = false;
	}
	
	public void setPartOfPair(boolean b){
		partOfPair = b;
	}
	
	public ArrayList<Characteristic> getCharacteristicList(){
		return characteristics;
	}
	
	public ArrayList<Employee> getBlacklist(){
		return blacklist;
	}
	
	public boolean isOnBlacklist(Employee e){
		for(int i = 0; i < blacklist.size(); i++){
			if(blacklist.get(i).getID() == id){
				return true;
			}
		}
		
		return false;
	}
	
	public void addCharacteristic(Characteristic c){
		characteristics.add(c);
	}
}

package algorithm;
import java.util.ArrayList;

class Employee {
	private int id;
	private boolean partOfPair;

	private ArrayList<Employee> blacklist;
	private int spotInArray, restroomUsage, noisePreference, outOfDesk;
	private boolean waitingToBeAssigned;
	private double totalSimilarity; 
	
	Employee(int idNum){
		id = idNum;
		blacklist = new ArrayList<Employee>();
		partOfPair = false;
		waitingToBeAssigned = true;
		totalSimilarity = 0;
	}
	
	int getID(){
		return id;
	}
	
	boolean partOfPair(){
		return partOfPair;
	}
	
	void setSpotInArray(int i){
		spotInArray = i;
	}
	
	int getSpotInArray(){
		return spotInArray;
	}
	
	double getTotalSimilarity(){
		return totalSimilarity;
	}
	
	void addToTotalSimilarity(double d){
		totalSimilarity += d;
	}
	
	//Returns true if the employee needs to be assigned. False otherwise.
	boolean waitingToBeAssigned(){
		return waitingToBeAssigned;
	}
	
	void assigned(){
		waitingToBeAssigned = false;
	}
	
	void setPartOfPair(boolean b){
		partOfPair = b;
	}
	

	ArrayList<Employee> getBlacklist(){
		return blacklist;
	}
	
	boolean isOnBlacklist(Employee e){
		for(int i = 0; i < blacklist.size(); i++){
			if(blacklist.get(i).getID() == id){
				return true;
			}
		}
		
		return false;
	}
	
	void setID(int id){
		this.id = id;
	}

	int getRestroomUsage() {
		return restroomUsage;
	}

	void setRestroomUsage(int restroomUsage) {
		this.restroomUsage = restroomUsage;
	}

	int getNoisePreference() {
		return noisePreference;
	}

	void setNoisePreference(int noisePreference) {
		this.noisePreference = noisePreference;
	}

	int getOutOfDesk() {
		return outOfDesk;
	}

	void setOutOfDesk(int outOfDesk) {
		this.outOfDesk = outOfDesk;
	}
}

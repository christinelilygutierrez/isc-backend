package algorithm;

public class Characteristic {
	private String characteristicName;
	private boolean validity; 
	private int relevanceScore; //To be implemented later.
	private String description;
	
	public Characteristic(){
		
	}
	
	public boolean getValidity(){
		return validity;
	}
	
	public String getName(){
		return characteristicName;
	}
	
	public int getScore(){
		return relevanceScore;
	}
	
	public String getDescription(){
		return description;
	}
	
	public void setName(String newName){
		characteristicName = newName;
	}
	
	public void setScore(int newScore){
		relevanceScore = newScore;
	}
	
	public void setDescription(String newDescription){
		description = newDescription;
	}
	
	public void setValidity(boolean newValidity){
		validity = newValidity;
	}
	
	//Only useful in the test version:
	public double getWeight(){
		switch(characteristicName){
		case "Noise":
			return 4.77;
		case "Department":
			return 7.12;
		case "Privacy":
			return 6.64;
		default:
			return 0;
		}
	}
}

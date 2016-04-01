package algorithm;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

import static java.lang.Math.toIntExact;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

public class IOParser {
	private File employeeFile;
	private File chartFile;
	private File similarityFile;
	private File outputFile;
	private ArrayList<Employee> employees;
	//private ArrayList<Characteristic> characteristics;
	private int[][] chart, chart2;
	private double[][] employeeSimilarities;
	private boolean jsonSimilaritiesArePresent;
	
	public IOParser(File chartFile){
		this.chartFile = chartFile;
		parseChartFile();
	}

	public IOParser(File employeeFile, boolean differentiator){
		this.employeeFile = employeeFile;
		parseEmployeeJSON();
	}
	
	public IOParser(File employeeFile, File chartFile, File similarityFile, boolean chartJSON, boolean employeeJSON){
		this.employeeFile = employeeFile;
		this.chartFile = chartFile;
		this.similarityFile = similarityFile;
		if(chartJSON){
			parseChartJSON();
		}
		else{
			parseChartFile();
		}
		if(employeeJSON){
			parseEmployeeJSON();
		}
		else{
			parseEmployeeFile();
		}
		
		jsonSimilaritiesArePresent = false;
		if(similarityFile != null){
			parseSimilarityJSON();
			jsonSimilaritiesArePresent = true;
		}
	}
	
	@SuppressWarnings("unchecked")
	public void createOutputFile(Chart finalChart){
		
		//Put employees in an array based on their desks. 
		Employee arrayOfEmployees[][] = new Employee[chart.length][chart[0].length];
		double currX, currY;
		for(int i = 0; i < finalChart.getNumberOfClusters(); i++){
			for(int j = 0; j < finalChart.getCluster(i).getNumberOfEmployees(); j++){
				currX = finalChart.getCluster(i).getDesk(j).getPoint().getX();
				currY = finalChart.getCluster(i).getDesk(j).getPoint().getY();
				arrayOfEmployees[(int)currX][(int)currY] = finalChart.getCluster(i).getDesk(j).getEmployee(); 
			}
		}
		
		JSONArray outerArray = new JSONArray();
		for(int i = 1; i < (chart.length - 1); i++){ //Change to only include inner area (not border walls)
			JSONArray innerArray = new JSONArray();
			for(int j = 1; j < (chart[0].length - 1); j++){
				JSONObject currentSpot = new JSONObject();
				JSONObject currentID = new JSONObject();
				currentID.put("col", (j - 1));
				currentID.put("row", (i - 1));
				String str = (i - 1) + "-" + (j - 1);
				currentID.put("str", str);
				currentSpot.put("id", currentID);
				if(((i % 2) == 0) && ((j % 2) == 0)){ //Should be "invisible"
					/*
					          "meta": {},
      						  "type": {
        						"id": "INVISIBLE"
      						  },
      						  "userId": null
					 */
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "INVISIBLE");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 1){ //AKA desk
					//Get employee at current desk.
					Employee currentEmployee = arrayOfEmployees[i][j];
					
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Desk");
					currentType.put("id", "DESK");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", currentEmployee.getID());
				}
				else if(chart[i][j] == 2){ //AKA empty wall
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Wall");
					currentType.put("id", "WALL");
					
					JSONObject currentOrientation = new JSONObject();
					if((i % 2) == 0){
						currentOrientation.put("desc", "Horizontal");
						currentOrientation.put("id", "HORIZONTAL");
					}
					else{
						currentOrientation.put("desc", "Vertical");
						currentOrientation.put("id", "VERTICAL");
					}
					
					currentType.put("orientation", currentOrientation);
					
					currentSpot.put("isPresent", false);
					currentSpot.put("type", currentType);	
				}
				else if(chart[i][j] == 3){ //AKA wall
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Wall");
					currentType.put("id", "WALL");
					
					JSONObject currentOrientation = new JSONObject();
					if((i % 2) == 0){
						currentOrientation.put("desc", "Horizontal");
						currentOrientation.put("id", "HORIZONTAL");
					}
					else{
						currentOrientation.put("desc", "Vertical");
						currentOrientation.put("id", "VERTICAL");
					}
					
					currentType.put("orientation", currentOrientation);
					
					currentSpot.put("isPresent", true);
					currentSpot.put("type", currentType);
					

				}
				else if(chart[i][j] == 4){ //AKA restroom 
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "RESTROOM");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 5){ //AKA conference 
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "CONFERENCE");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 6){ //AKA air conditioner
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "AIRCONDITIONER");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else{ //For now let's just put everything else in as empty space.
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "EMPTY");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				
				innerArray.add(currentSpot);
			}
			outerArray.add(innerArray);
		}

		try {
			outputFile = new File("Output.json");
			FileWriter fileWriter = new FileWriter(outputFile);
			fileWriter.write(outerArray.toJSONString());
			fileWriter.flush();
			fileWriter.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public File getOutputFile(){
		return outputFile;
	}
	
	public boolean jsonSimilaritiesArePresent(){
		return jsonSimilaritiesArePresent;
	}
	
	private void parseSimilarityJSON(){
		employeeSimilarities = new double[employees.size()][employees.size()];
		
		JSONParser parser = new JSONParser();
		
		Object obj = null;
		try {
			obj = parser.parse(new FileReader(similarityFile));
			//obj = parser.parse(new FileReader("C:\\Users\\Jack Bankston\\Desktop\\spots-data-structure.json"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		JSONArray jsonArray = (JSONArray) obj;
		
		for(int i = 0; i < jsonArray.size(); i++){
			JSONObject currSim = (JSONObject) jsonArray.get(i);
			
			int spotInArray1 = getSpotInArrayByID(toIntExact((long)currSim.get("employeeId1")));
			int spotInArray2 = getSpotInArrayByID(toIntExact((long)currSim.get("employeeId2")));
			
			//System.out.println("1: " + spotInArray1 + " / 2: " + spotInArray2);
			employeeSimilarities[spotInArray1][spotInArray2] = (double)currSim.get("similarity");
			employeeSimilarities[spotInArray2][spotInArray1] = (double)currSim.get("similarity");
		}
		
		/*System.out.println("");
		for(int i = 0; i < employees.size(); i++){
			System.out.println("Employee: " + i + " -- ID: " + employees.get(i).getID() + " -- Spot in array: " + employees.get(i).getSpotInArray());
		}
		
		System.out.println("");
		System.out.println("SIMILARITIES:");
		for(int i = 0; i < employees.size(); i++){
			for(int j = 0; j < employees.size(); j++){
				System.out.print(employeeSimilarities[i][j] + " ");
			}
			System.out.println("");
		}*/
		
	}
	
	private int getSpotInArrayByID(int id){
		//System.out.print("id (" + id + "):");
		for(int i = 0; i < employees.size(); i++){
			if(employees.get(i).getID() == id){
				return employees.get(i).getSpotInArray();
			}
			//System.out.print(" " + employees.get(i).getID());
		}
		//System.out.println("");
		return 0;
	}
	
	private void parseEmployeeJSON(){
		//To be completed
		employees = new ArrayList<Employee>();
		
		JSONParser parser = new JSONParser();

		Object obj = null;
		try {
			obj = parser.parse(new FileReader(employeeFile));
			//obj = parser.parse(new FileReader("C:\\Users\\Jack Bankston\\Desktop\\spots-data-structure.json"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		JSONArray jsonArray = (JSONArray) obj;
		
		for(int i = 0; i < jsonArray.size(); i++){
			//Make a new employee out of employee information at current object. 
			JSONObject currentEmployee = (JSONObject) jsonArray.get(i);
			
			employees.add(new Employee(toIntExact((Long)currentEmployee.get("employeeID"))));
		}
		
		for(int i = 0; i < employees.size(); i++){
			employees.get(i).setSpotInArray(i);
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public void writeSimilaritiesToJSON(Similarity sim){
		int numberOfEmployees = sim.getEmployeeSimilarities().length;
		
		JSONArray arrayOfSimilarities = new JSONArray();
		for(int i = 0; i < numberOfEmployees; i++){
			for(int j = i + 1; j < numberOfEmployees; j++){
				JSONObject newSimilarity = new JSONObject();
				newSimilarity.put("employeeId1", employees.get(i).getID());
				newSimilarity.put("employeeId2", employees.get(j).getID());
				newSimilarity.put("similarity", sim.getSpecificEmployeeSimilarity(i, j));
				arrayOfSimilarities.add(newSimilarity);
			}
		}
		
		try {
			FileWriter file = new FileWriter("C:\\Users\\Jack Bankston\\Desktop\\similarities" + numberOfEmployees + ".json");
			file.write(arrayOfSimilarities.toJSONString());
			file.flush();
			file.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void parseChartJSON(){
		JSONParser parser = new JSONParser();
		
		Object obj = null;
		try {
			obj = parser.parse(new FileReader(chartFile));
			//obj = parser.parse(new FileReader("C:\\Users\\Jack Bankston\\Desktop\\spots-data-structure.json"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
		JSONArray jsonArray = (JSONArray) obj;
		
		/*
		//System.out.println("TESTING THE SAMPLE JSON FILE");
		for(int h = 0; h < jsonArray.size(); h++){
			JSONArray currentArray = (JSONArray) jsonArray.get(h);
			if(h == 0){
				//chart = new int[jsonArray.size()][currentArray.size()];
			}
			for(int i = 0; i < currentArray.size(); i++){
				JSONObject currentSpot = (JSONObject) currentArray.get(i);
				JSONObject currentType = (JSONObject) currentSpot.get("type");
				
				String typeIdString = (String) currentType.get("id");
				if(typeIdString.equalsIgnoreCase("wall")){
					JSONObject currentOrientation = (JSONObject) currentType.get("orientation");
					String orientationString = (String) currentOrientation.get("id");
					if(orientationString.equalsIgnoreCase("vertical")){
						System.out.print("| ");
					}
					else{
						System.out.print("- ");
					}
				}
				else if(typeIdString.equalsIgnoreCase("invisible")){
					System.out.print("X ");
				}
				else{
					
					System.out.print("O ");
				}
				//System.out.print(spotToInt(currentSpot) + " ");
				//JSONObject currentID = (JSONObject) currentSpot.get("id");
				//chart[toIntExact((Long)currentID.get("row"))][toIntExact((Long)currentID.get("col"))] = spotToInt(currentSpot);
			}
			System.out.println("");
		}	
		*/
		//System.out.println("");
		for(int h = 0; h < jsonArray.size(); h++){
			JSONArray currentArray = (JSONArray) jsonArray.get(h);
			if(h == 0){
				chart2 = new int[jsonArray.size()][currentArray.size()];
			}
			for(int i = 0; i < currentArray.size(); i++){
				JSONObject currentSpot = (JSONObject) currentArray.get(i);
				//System.out.print(spotToInt(currentSpot) + " ");
				//System.out.print(spotToInt(currentSpot) + " ");
				JSONObject currentID = (JSONObject) currentSpot.get("id");
				chart2[toIntExact((Long)currentID.get("row"))][toIntExact((Long)currentID.get("col"))] = spotToInt(currentSpot);
			}
			//System.out.println("");
		}
		
		dealWithInvisibleSpots();
		
		/*
		//Let's see what that looks like:
		for(int i = 0; i < chart2.length; i++){
			for(int j = 0; j < chart2[0].length; j++){
				System.out.print(chart2[i][j] + " ");
			}
			System.out.println("");
		}*/
		
		addWallBorder();
		//chart = chart2;
		
		/*
		System.out.println("CHART 3");
		for(int i = 0; i < chart3.length; i++){
			for(int j = 0; j < chart3[0].length; j++){
				System.out.print(chart3[i][j] + " ");
			}
			System.out.println("");
		}*/
	}
	
	//Add border of 3s (to represent a wall) around the chart. 
	private void addWallBorder(){
		int dim1 = chart2.length;
		int dim2 = chart2[0].length;
		
		//System.out.println("Dimensions of chart2: " + dim1 + " X " + dim2);
		
		//Chart needs to be 2 bigger in each dimension;
		chart = new int[dim1 + 2][dim2 + 2];
		
		for(int i = 0; i < (dim2 + 2); i++){
			chart[0][i] = 3;
		}
		for(int i = 0; i < (dim2 + 2); i++){
			chart[dim1 + 1][i] = 3;
		}
		for(int i = 0; i < (dim1 + 2); i++){
			chart[i][0] = 3;
		}
		for(int i = 0; i < (dim1 + 2); i++){
			chart[i][dim2 + 1] = 3;
		}
		
		for(int i = 0; i < dim1; i++){
			for(int j = 0; j < dim2; j++){
				//System.out.println("Accessing: " + (i) + " " + (j));
				chart[i + 1][j + 1] = chart2[i][j];
			}
		}
	}
	
	private void dealWithInvisibleSpots(){
		int dim1 = chart2.length;
		int dim2 = chart2[0].length;
		
		for(int i = 0; i < dim1; i++){
			for(int j = 0; j < dim2; j++){
				if(chart2[i][j] == -1){
					if(searchSurroundingPointsForAWall(i,j)){
						chart2[i][j] = 3;
					}
					else{
						chart2[i][j] = 2;
					}
				}
			}
		}
	}
	
	private boolean searchSurroundingPointsForAWall(int x, int y){
		//Check 4 non-diagonal surrounding points for a wall.
		int xMax = chart2.length;
		int yMax =  chart2[0].length;
		if(x != 0){
			if(chart2[x - 1][y] == 3){
				return true;
			}
		}
		if(y != 0){
			if(chart2[x][y-1] == 3){
				return true;
			}
		}
		if((x + 1) < xMax){
			if(chart2[x+1][y] == 3){
				return true;
			}
		}
		if((y + 1) < yMax){
			if(chart2[x][y+1] == 3){
				return true;
			}
		}
		//System.out.println("(" + x + "," + ") is a single point");
		return false;
	}
	
	@SuppressWarnings("unchecked")
	public void writeChartToJSON(String fileName){
		
		JSONArray outerArray = new JSONArray();
		for(int i = 1; i < (chart.length - 1); i++){ //Change to only include inner box (not border walls)
			JSONArray innerArray = new JSONArray();
			for(int j = 1; j < (chart[0].length - 1); j++){
				JSONObject currentSpot = new JSONObject();
				JSONObject currentID = new JSONObject();
				currentID.put("col", (j - 1));
				currentID.put("row", (i - 1));
				String str = (i - 1) + "-" + (j - 1);
				currentID.put("str", str);
				currentSpot.put("id", currentID);
				if(((i % 2) == 0) && ((j % 2) == 0)){ //Should be "invisible"
					/*
					          "meta": {},
      						  "type": {
        						"id": "INVISIBLE"
      						  },
      						  "userId": null
					 */
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "INVISIBLE");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userID", null);
				}
				else if(chart[i][j] == 1){ //AKA desk
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Desk");
					currentType.put("id", "DESK");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userID", null);
				}
				else if(chart[i][j] == 2){ //AKA empty wall
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Wall");
					currentType.put("id", "WALL");
					
					JSONObject currentOrientation = new JSONObject();
					if((i % 2) == 0){
						currentOrientation.put("desc", "Horizontal");
						currentOrientation.put("id", "HORIZONTAL");
					}
					else{
						currentOrientation.put("desc", "Vertical");
						currentOrientation.put("id", "VERTICAL");
					}
					
					currentType.put("orientation", currentOrientation);
					
					currentSpot.put("isPresent", false);
					currentSpot.put("type", currentType);	
				}
				else if(chart[i][j] == 3){ //AKA wall
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Wall");
					currentType.put("id", "WALL");
					
					JSONObject currentOrientation = new JSONObject();
					if((i % 2) == 0){
						currentOrientation.put("desc", "Horizontal");
						currentOrientation.put("id", "HORIZONTAL");
					}
					else{
						currentOrientation.put("desc", "Vertical");
						currentOrientation.put("id", "VERTICAL");
					}
					
					currentType.put("orientation", currentOrientation);
					
					currentSpot.put("isPresent", true);
					currentSpot.put("type", currentType);
					

				}
				else if(chart[i][j] == 4){ //AKA restroom 
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "RESTROOM");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userID", null);
				}
				else if(chart[i][j] == 5){ //AKA conference 
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "CONFERENCE");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userID", null);
				}
				else if(chart[i][j] == 6){ //AKA air conditioner
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "AIRCONDITIONER");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userID", null);
				}
				else{ //For now let's just put everything else in as empty space.
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "EMPTY");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userID", null);
				}
				
				innerArray.add(currentSpot);
			}
			outerArray.add(innerArray);
		}

		try {
			FileWriter file = new FileWriter("C:\\Users\\Jack Bankston\\Desktop\\" + fileName + ".json");
			file.write(outerArray.toJSONString());
			file.flush();
			file.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void writeEmployeesToJSON(String fileName){
		
	}
	
	private int spotToInt(JSONObject spot){
		JSONObject typeObject = (JSONObject) spot.get("type");
		String typeIDString = (String) typeObject.get("id");
		if(typeIDString.equalsIgnoreCase("desk")){
			return 1;
		}
		if(typeIDString.equalsIgnoreCase("restroom")){
			return 4;
		}
		if(typeIDString.equalsIgnoreCase("conference")){
			return 5;
		}
		if(typeIDString.equalsIgnoreCase("airconditioner")){
			return 6;
		}
		if(typeIDString.equalsIgnoreCase("wall")){
			boolean isPresent = (boolean) spot.get("isPresent");
			if(isPresent){
				return 3;
			}
			else{
				return 2;
			}
		}
		if(typeIDString.equalsIgnoreCase("invisible")){
			return -1;
		}
		return 0;
	}
	
	private void parseEmployeeFile(){
		ArrayList<String> inputFileLines = new ArrayList<String>();
		Scanner lineScanner = null;
		try {
			lineScanner = new Scanner(employeeFile);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		while(lineScanner.hasNextLine()){
			inputFileLines.add(lineScanner.nextLine());
		}
		lineScanner.close();
		
		int size = inputFileLines.size();
		
		employees = new ArrayList<Employee>();
		ArrayList<String> characteristicNames = getCharacteristicNames(inputFileLines.get(0));
		
		for(int i = 0; i < size; i++){
			//System.out.println(inputFileLines.get(i));
			if(i != 0){
				Employee newEmp = makeEmployee(inputFileLines.get(i), characteristicNames);
				employees.add(newEmp);
			}
		}
		
		for(int i = 0; i < employees.size(); i++){
			employees.get(i).setSpotInArray(i);
		}
			
	}
	
	private void parseChartFile(){
		ArrayList<String> inputLines = new ArrayList<String>();
		Scanner scanner = null;
		try {
			scanner = new Scanner(chartFile);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		while(scanner.hasNextLine()){
			inputLines.add(scanner.nextLine());
		}
		scanner.close();
		
		int yDimension = inputLines.size();
		int xDimension = 0;
		Scanner firstCountScanner = new Scanner(inputLines.get(0));
		firstCountScanner.useDelimiter(",");
		while(firstCountScanner.hasNext()){
			xDimension++;
			firstCountScanner.next();
		}
		firstCountScanner.close();
		
		chart = new int[yDimension][xDimension];
		int yCounter;
		//Set up a real scanner to get input data into an array:
		for(int i = 0; i < yDimension; i++){
			Scanner dataScanner = new Scanner(inputLines.get(i));
			dataScanner.useDelimiter(",");
			yCounter = 0;
			while(dataScanner.hasNext()){
				chart[i][yCounter] = Integer.parseInt(dataScanner.next());
				yCounter++;
			}
			dataScanner.close();
		}
	}
	
	public ArrayList<Employee> getEmployeeArrayList(){
		return employees;
	}
	
	/*public ArrayList<Characteristic> getCharacteristicArrayList(){
		return characteristics;
	}*/
	
	public int[][] getChartIntegerArray(){
		return chart;
	}
	
	public double[][] getEmployeeSimilaritiesArray(){
		return employeeSimilarities;
	}
	
	private ArrayList<String> getCharacteristicNames(String data){
		ArrayList<String> characteristicNames = new ArrayList<String>();
		Scanner currentLineScanner = new Scanner(data);
		currentLineScanner.useDelimiter(",");
		currentLineScanner.next();
		while(currentLineScanner.hasNext()){
			characteristicNames.add(currentLineScanner.next());
		}
		currentLineScanner.close();
		
		return characteristicNames;
	}
	
	private Employee makeEmployee(String data, ArrayList<String> characteristicNames){
		Scanner currentLineScanner = new Scanner(data);
		currentLineScanner.useDelimiter(",");
		
		Employee newEmployee = new Employee(Integer.parseInt(currentLineScanner.next()));
		String currentInfo;
		int counter = 0;
		while(currentLineScanner.hasNext()){
			Characteristic newCharacteristic = new Characteristic();
			currentInfo = currentLineScanner.next();
			if(currentInfo.equalsIgnoreCase("TRUE"))
				newCharacteristic.setValidity(true);
			else if(currentInfo.equalsIgnoreCase("FALSE"))
				newCharacteristic.setValidity(false);
			else
				newCharacteristic.setDescription(currentInfo);
			newCharacteristic.setName(characteristicNames.get(counter));
			newEmployee.addCharacteristic(newCharacteristic);
			counter++;
		}
		
		currentLineScanner.close();
		return newEmployee;
	}
	
}

/*
 * This is the file that takes in command line arguments and calls the actual algorithm.
 * The commented out code will display the seating chart that is created.
 */

package algorithm_control;

import java.io.File;
import java.io.FileNotFoundException;

/*
import static java.lang.Math.toIntExact;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridLayout;
import java.awt.Insets;
import java.io.FileReader;
import java.io.IOException;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
*/

import algorithm.Alg;

public class AlgorithmControl {

	public static void main(String[] args) {
		String chartFile = args[0];
		String employeeFile = args[1];
		String similarityFile = args[2];
		String outputFile = args[3];
		
		Alg alg = new Alg();
		try {
			alg.Algorithm(new File(chartFile), new File(employeeFile), new File(similarityFile), new File(outputFile));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//displayChart(outputFile);
	}
	
	/*
	private static void displayChart(String outputFile){
		JSONParser parser = new JSONParser();

		Object obj = null;
		try {
			obj = parser.parse(new FileReader(new File(outputFile)));
			//obj = parser.parse(new FileReader("C:\\Users\\Jack Bankston\\Desktop\\Output.json"));
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
		
		
		JSONArray array = (JSONArray) obj;
		showChart(array);
	}
	
	
	private static void showChart(JSONArray array){
		int numberOfRows = array.size();
		JSONArray firstRow = (JSONArray) array.get(0);
		int numberOfColumns = firstRow.size();
		
		int chartArray[][] = new int[numberOfRows][numberOfColumns];
		
		for(int i = 0; i < numberOfRows; i++){
			JSONArray currentRow = (JSONArray) array.get(i);
			for(int j = 0; j < numberOfColumns; j++){
				JSONObject currentSpot = (JSONObject) currentRow.get(j);
				JSONObject currentType = (JSONObject) currentSpot.get("type");
				String currentID = (String) currentType.get("id");
				
				if(currentID.equalsIgnoreCase("invisible")){
					chartArray[i][j] = -9; 
				}
				else if(currentID.equalsIgnoreCase("wall")){
					boolean currentIsPresent = (boolean) currentSpot.get("isPresent");
					if(currentIsPresent){
						chartArray[i][j] = -4; //Wall
					}
					else{
						chartArray[i][j] = -3; //Empty Wall
					}
				}
				else if(currentID.equalsIgnoreCase("empty")){
					chartArray[i][j] = -1; //Empty space
				}
				else if(currentID.equalsIgnoreCase("desk")){
					if(currentSpot.get("userId") != null){
						long currentEmployeeId = (long) currentSpot.get("userId");
						chartArray[i][j] = toIntExact(currentEmployeeId);
					}
					else{
						chartArray[i][j] = 0;
					}
				}
				else if(currentID.equalsIgnoreCase("restroom")){
					chartArray[i][j] = -5; //Restroom
				}
				else if(currentID.equalsIgnoreCase("conference")){
					chartArray[i][j] = -6; //Conference
				}
				else if(currentID.equalsIgnoreCase("airconditioner")){
					chartArray[i][j] = -7; //Air conditioner
				}
			}
		}
		
		//Sort out invisible spots.
		for(int i = 0; i < numberOfRows; i++){
			for(int j = 0; j < numberOfColumns; j++){
				if(chartArray[i][j] == -9){
					if(i != 0){
						if(chartArray[i - 1][j] == -4){
							chartArray[i][j] = -4;
						}
					}
					if(j != 0){
						if(chartArray[i][j - 1] == -4){
							chartArray[i][j] = -4;
						}
					}
					if((i + 1) != numberOfRows){
						if(chartArray[i + 1][j] == -4){
							chartArray[i][j] = -4;
						}
					}
					if((j + 1) != numberOfColumns){
						if(chartArray[i][j + 1] == -4){
							chartArray[i][j] = -4;
						}
					}
					
					if(chartArray[i][j] == -9){
						chartArray[i][j] = -3;
					}
				}
			}
		}
		
		JFrame chartFrame = new JFrame("Chart");
		
		GridBagConstraints c = new GridBagConstraints();
		
		int xDimension = numberOfRows;
		int yDimension = numberOfColumns;
		GridLayout gridLayout = new GridLayout(xDimension,yDimension);
		gridLayout.setHgap(5);
		gridLayout.setVgap(5);
		
		JPanel chartPanel = new JPanel(gridLayout);
		chartPanel.setBackground(Color.BLACK);
		
		JLabel spotLabels[][] = new JLabel[xDimension][yDimension];
		
		JPanel spotPanels[][] = new JPanel[xDimension][yDimension];
		for(int i = 0; i < xDimension; i++){
			for(int j = 0; j < yDimension; j++){
				spotPanels[i][j] = new JPanel(new BorderLayout());
				spotLabels[i][j] = new JLabel("");
				
				if(xDimension > 40){
					spotLabels[i][j].setFont(new Font("Dialog", Font.BOLD, 7));
				}
				else{
					spotLabels[i][j].setFont(new Font("Dialog", Font.BOLD, 20));
				}
				
				spotLabels[i][j].setHorizontalAlignment(JLabel.CENTER);
				spotLabels[i][j].setVerticalAlignment(JLabel.CENTER);
				
				if((chartArray[i][j] > -1)){
					spotPanels[i][j].setBackground(Color.CYAN);
					spotLabels[i][j].setText("" + chartArray[i][j]);
					spotLabels[i][j].setForeground(Color.BLACK);
				}
				else{
					spotPanels[i][j].setBackground(Color.GRAY);
				}
				spotPanels[i][j].add(spotLabels[i][j], BorderLayout.CENTER);
			}
		}
		
		//Let's show some walls:
		for(int i = 0; i < xDimension; i++){
			for(int j = 0; j < yDimension; j++){
				if(chartArray[i][j] == -3){
					spotPanels[i][j].setBackground(Color.black);
				}
				if(chartArray[i][j] == -4){
					spotPanels[i][j].setBackground(Color.white);
				}
				if(chartArray[i][j] == -5){
					spotPanels[i][j].setBackground(Color.green);
					spotLabels[i][j].setText("R");
					spotLabels[i][j].setForeground(Color.black);
				}
				if(chartArray[i][j] == -6){
					spotPanels[i][j].setBackground(Color.magenta);
					spotLabels[i][j].setText("C");
					spotLabels[i][j].setForeground(Color.BLACK);
				}
				if(chartArray[i][j] == -7){
					spotPanels[i][j].setBackground(Color.yellow);
					spotLabels[i][j].setText("AC");
					spotLabels[i][j].setForeground(Color.BLACK);
				}
			}
		}
		
		c.insets = new Insets(1, 1, 1, 1);
		c.gridx = 0;
		for(int i = 0; i < xDimension; i++){
			for(int j = 0; j < yDimension; j++){
				c.gridy = i;
				c.gridx = j;
				chartPanel.add(spotPanels[i][j]);
			}
		}

		chartFrame.setVisible(true);
		chartFrame.setExtendedState(JFrame.MAXIMIZED_BOTH);
		chartFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		chartFrame.setLocationRelativeTo(null);
		chartFrame.add(chartPanel);
		
	}
	*/
}

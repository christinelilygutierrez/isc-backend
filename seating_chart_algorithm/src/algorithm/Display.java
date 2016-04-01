package algorithm;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;

import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.filechooser.FileNameExtensionFilter;


public class Display {
	private JFrame frame;
	private JPanel panel;
	private JButton chartButton, chartJsonButton, employeeButton, employeeJsonButton, runButton, preSelectButton0, preSelectButton1, preSelectButton2;
	private JButton similarityJsonButton, convertCsvToJsonButton, convertCsvToJsonButton1, similarityToJsonButton;
	private JLabel chartLocation, employeeLocation, similarityLocation, preSelectedLabel, randomLabel, orLabel, orLabel1;
	private JCheckBox checkbox;
	private Color backgroundColor = new Color(253,253,253); 
	private Color buttonColor = new Color(224,224,224);
	private File chartFile, employeeFile, similarityFile;
	private boolean chartSelected, employeeSelected, similaritySelected;
	private static Alg alg;
	private Chart chart;
	private JFrame scoreFrame;
	private boolean csvOrJson, csvOrJson1;
	
	public Display(){
		frame = new JFrame("Seating Chart Algorithm");
		panel = new JPanel(new GridBagLayout());
		panel.setBackground(backgroundColor);
		
		chartButton = new JButton("Choose CSV Chart");
		chartButton.setFont(new Font("Dialog", Font.BOLD, 12));
		orLabel = new JLabel("OR");
		orLabel1 = new JLabel("OR");
		chartButton.setBackground(buttonColor);
		chartJsonButton = new JButton("Choose JSON Chart");
		chartJsonButton.setFont(new Font("Dialog", Font.BOLD, 12));
		chartJsonButton.setBackground(buttonColor);
		employeeButton = new JButton("Choose CSV Employees");
		employeeButton.setFont(new Font("Dialog", Font.BOLD, 12));
		employeeButton.setBackground(buttonColor);
		employeeJsonButton = new JButton("Choose JSON Employees");
		employeeJsonButton.setFont(new Font("Dialog", Font.BOLD, 12));
		employeeJsonButton.setBackground(buttonColor);
		runButton = new JButton("Run");
		runButton.setFont(new Font("Dialog", Font.BOLD, 12));
		runButton.setBackground(buttonColor);
	
		chartLocation = new JLabel("Default");
		chartLocation.setForeground(backgroundColor);
		employeeLocation = new JLabel("Default");
		employeeLocation.setForeground(backgroundColor);
		similarityLocation = new JLabel("Default");
		similarityLocation.setForeground(backgroundColor);
		
		preSelectButton0 = new JButton("32 Employees");
		preSelectButton0.setFont(new Font("Dialog", Font.BOLD, 12));
		preSelectButton0.setBackground(buttonColor);
		preSelectedLabel = new JLabel("Pre-Selected:");
		preSelectButton1 = new JButton("64 Employees");
		preSelectButton1.setFont(new Font("Dialog", Font.BOLD, 12));
		preSelectButton1.setBackground(buttonColor);
		preSelectButton2 = new JButton("250 Employees");
		preSelectButton2.setFont(new Font("Dialog", Font.BOLD, 12));
		preSelectButton2.setBackground(buttonColor);
		convertCsvToJsonButton = new JButton("Convert CSV to JSON (Chart)");
		convertCsvToJsonButton.setFont(new Font("Dialog", Font.BOLD, 12));
		convertCsvToJsonButton.setBackground(buttonColor);
		convertCsvToJsonButton1 = new JButton("Convert CSV to JSON (Employees)");
		convertCsvToJsonButton1.setFont(new Font("Dialog", Font.BOLD, 12));
		convertCsvToJsonButton1.setBackground(buttonColor);
		similarityJsonButton = new JButton("Choose JSON Similarities");
		similarityJsonButton.setFont(new Font("Dialog", Font.BOLD, 12));
		similarityJsonButton.setBackground(buttonColor);
		similarityToJsonButton = new JButton("Create Similarities JSON for Chosen Employees");
		similarityToJsonButton.setFont(new Font("Dialog", Font.BOLD, 12));
		similarityToJsonButton.setBackground(buttonColor);
		
		
		chartSelected = false;
		employeeSelected = false;
		
		checkbox = new JCheckBox();
		checkbox.setBackground(backgroundColor);
		randomLabel = new JLabel("Random");
		randomLabel.setFont(new Font("Dialog", Font.BOLD, 12));
		
		csvOrJson = false;
		csvOrJson1 = false;
		
		similarityFile = null;
		
		gui();
	}
	
	public void gui(){
		//chartLocation.setVisible(false);
		GridBagConstraints c = new GridBagConstraints();
		JPanel randomPanel = new JPanel(new GridBagLayout());
		randomPanel.setBackground(backgroundColor);
		c.gridx = 0;
		c.gridy = 0;
		randomPanel.add(checkbox, c);
		c.gridx = 1;
		randomPanel.add(randomLabel, c);
		
		frame.setVisible(true);
		frame.setSize(500, 600);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLocationRelativeTo(null);
		
		c.gridx = 0;
		c.gridy = 1;
		c.insets = new Insets(10, 10, 10, 10);
		panel.add(chartButton,c);
		c.gridx = 0;
		c.gridy = 0;
		//panel.add(orLabel,c);
		c.gridx = 0;
		c.gridy = 2;
		panel.add(chartJsonButton,c);
		
		c.gridx = 0;
		c.gridy = 3;
		panel.add(chartLocation,c);
		c.gridy = 4;
		panel.add(convertCsvToJsonButton, c);
		c.gridy = 5;
		panel.add(employeeButton,c);
		c.gridy = 6;
		//panel.add(orLabel1, c);
		panel.add(employeeJsonButton, c);
		c.gridy = 7;
		panel.add(employeeLocation, c);
		c.gridy = 8;
		panel.add(convertCsvToJsonButton1, c);
		c.gridy = 9;
		panel.add(similarityJsonButton,c);
		c.gridy = 10;
		panel.add(similarityLocation, c);
		c.gridy = 11;
		panel.add(similarityToJsonButton, c);
		
		c.gridx = 1;
		c.gridy = 1;
		panel.add(preSelectedLabel, c);
		c.gridy = 2;
		panel.add(preSelectButton0, c);
		c.gridy = 3;
		panel.add(preSelectButton1,c);
		c.gridy = 4;
		panel.add(preSelectButton2, c);
		c.gridy = 5;
		panel.add(randomPanel, c);
		c.gridy = 6;
		panel.add(runButton,c);
		
		frame.add(panel);
		
		ActionListener chartListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("CSV Files", "csv"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                chartFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(chartFile.getName());
	                //Now let's update the panel.
	                chartLocation.setText(chartFile.getName());
	                chartLocation.setForeground(Color.BLACK);
	                
	                chartSelected = true;
	                csvOrJson = false;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } 
			}
		};
		chartButton.addActionListener(chartListener);
		
		ActionListener chartJsonListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("JSON Files", "json"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                chartFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(chartFile.getName());
	                //Now let's update the panel.
	                chartLocation.setText(chartFile.getName());
	                chartLocation.setForeground(Color.BLACK);
	                
	                chartSelected = true;
	                csvOrJson = true;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } 
			}
		};
		chartJsonButton.addActionListener(chartJsonListener);
		
		ActionListener similarityJsonListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("JSON Files", "json"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                similarityFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(similarityFile.getName());
	                //Now let's update the panel.
	                similarityLocation.setText(similarityFile.getName());
	                similarityLocation.setForeground(Color.BLACK);
	                
	                similaritySelected = true;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } 
			}
		};
		similarityJsonButton.addActionListener(similarityJsonListener);
		
		ActionListener similarityToJsonListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				IOParser iop = new IOParser(employeeFile, true);
				Similarity sim = new Similarity();
				sim.computeEmployeeSimilarities(iop.getEmployeeArrayList(), null);
				iop.writeSimilaritiesToJSON(sim);
				
				JOptionPane.showMessageDialog(null, "Success! Check the desktop for the file!");
			}
		};
		similarityToJsonButton.addActionListener(similarityToJsonListener);
		
		
		
		ActionListener convertCsvToJsonListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				
				if(!csvOrJson){
					IOParser ip = new IOParser(chartFile);
					ip.writeChartToJSON(chartLocation.getText());
					String outputString = "Success!\n" + chartLocation.getText() + ".json can be found on the desktop.";
					JOptionPane.showMessageDialog(null, outputString);
				}
				/*final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("CSV Files", "csv"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                chartFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(chartFile.getName());
	                //Now let's update the panel.
	                chartLocation.setText(chartFile.getName());
	                chartLocation.setForeground(Color.BLACK);
	                
	                chartSelected = true;
	                csvOrJson = false;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } */
			}
		};
		convertCsvToJsonButton.addActionListener(convertCsvToJsonListener);
		
		ActionListener convertCsvToJsonListener1 = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				if(!csvOrJson1){
					IOParser ip = new IOParser(employeeFile);
					ip.writeEmployeesToJSON(employeeLocation.getText());
					String outputString = "Success!\n" + employeeLocation.getText() + ".json can be found on the desktop.";
					JOptionPane.showMessageDialog(null, outputString);
				}
				/*final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("CSV Files", "csv"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                chartFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(chartFile.getName());
	                //Now let's update the panel.
	                chartLocation.setText(chartFile.getName());
	                chartLocation.setForeground(Color.BLACK);
	                
	                chartSelected = true;
	                csvOrJson = false;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } */
			}
		};
		convertCsvToJsonButton1.addActionListener(convertCsvToJsonListener1);
		
		ActionListener employeeListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("CSV Files", "csv"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                employeeFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(employeeFile.getName());
	                //Now let's update the panel.
	                employeeLocation.setText(employeeFile.getName());
	                employeeLocation.setForeground(Color.BLACK);
	                
	                employeeSelected = true;
	                csvOrJson1 = false;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } 
			}
		};
		employeeButton.addActionListener(employeeListener);	
		
		ActionListener employeeJsonListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				final JFileChooser fc = new JFileChooser("C:\\Users\\Jack Bankston\\Desktop\\");
				fc.setFileFilter(new FileNameExtensionFilter("JSON Files", "json"));
				int returnVal = fc.showOpenDialog(null);
				
				if (returnVal == JFileChooser.APPROVE_OPTION) {//User hit open.
	                employeeFile = fc.getSelectedFile();
	                //if(csvFile()){
	                //Let's test whether that worked or not.
	                System.out.println(employeeFile.getName());
	                //Now let's update the panel.
	                employeeLocation.setText(employeeFile.getName());
	                employeeLocation.setForeground(Color.BLACK);
	                
	                employeeSelected = true;
	                csvOrJson1 = true;
	                
	                frame.setContentPane(panel);
	        		frame.invalidate();
	        		frame.validate();
	            } 
			}
		};
		employeeJsonButton.addActionListener(employeeJsonListener);	
		
		ActionListener runListener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				if(chartSelected && employeeSelected){
					alg = new Alg();
					try {
						chart = alg.Algorithm(chartFile, employeeFile, similarityFile, false, checkbox.isSelected(), csvOrJson, csvOrJson1);
					} catch (FileNotFoundException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				else{
					alg = new Alg();
					try {
						chart = alg.Algorithm(chartFile, employeeFile, similarityFile, true, checkbox.isSelected(), csvOrJson, csvOrJson1);
					} catch (FileNotFoundException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				//if(!csvOrJson1){
					displayChart();	
				//}
			}
		};
		runButton.addActionListener(runListener);
		
		ActionListener preSelect0Listener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				alg = new Alg();
				try {
					File chartSelect1 = new File("C:\\Users\\Jack Bankston\\Desktop\\ChartTestData32.csv.json");
					File employeeSelect1 = new File("C:\\Users\\Jack Bankston\\Desktop\\employee32JSON.json");
					File similaritySelect1 = new File("C:\\Users\\Jack Bankston\\Desktop\\similarities32.json");
					chart = alg.Algorithm(chartSelect1, employeeSelect1, similaritySelect1, false, checkbox.isSelected(), true, true);
				} catch (FileNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				displayChart();
			}
		};
		preSelectButton0.addActionListener(preSelect0Listener);
		
		ActionListener preSelect1Listener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				alg = new Alg();
				try {
					File chartSelect1 = new File("C:\\Users\\Jack Bankston\\Desktop\\ChartTestData64.csv");
					File employeeSelect1 = new File("C:\\Users\\Jack Bankston\\Desktop\\EmployeeTestData64.csv");
					chart = alg.Algorithm(chartSelect1, employeeSelect1, similarityFile, false, checkbox.isSelected(), false, false);
				} catch (FileNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				displayChart();
			}
		};
		preSelectButton1.addActionListener(preSelect1Listener);
		
		ActionListener preSelect2Listener = new ActionListener(){
			public void actionPerformed(ActionEvent evt){
				alg = new Alg();
				try {
					File chartSelect2 = new File("C:\\Users\\Jack Bankston\\Desktop\\ChartTestData250.csv");
					File employeeSelect2 = new File("C:\\Users\\Jack Bankston\\Desktop\\EmployeeTestData250.csv");
					chart = alg.Algorithm(chartSelect2, employeeSelect2, similarityFile, false, checkbox.isSelected(), false, false);
				} catch (FileNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				displayChart();
			}
		};
		preSelectButton2.addActionListener(preSelect2Listener);
	}
	
	public void displayChart(){
		JFrame chartFrame = new JFrame("Chart");
		//JPanel chartPanel = new JPanel(new FlowLayout());
		
		GridBagConstraints c = new GridBagConstraints();
		
		int xDimension = chart.getXDim();
		//System.out.println("X : " + xDimension);
		int yDimension = chart.getYDim();
		//System.out.println("Y : " + yDimension);
		GridLayout gridLayout = new GridLayout(xDimension,yDimension);
		gridLayout.setHgap(5);
		gridLayout.setVgap(5);
		
		JPanel chartPanel = new JPanel(gridLayout);
		chartPanel.setBackground(Color.BLACK);
		
		
		/*JLabel spotLabel = new JLabel("Test");
		c.insets = new Insets(10, 10, 10, 10);
		c.gridx = 0;
		c.gridy = 0;*/
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
				
				if(chart.checkIfClustered(i, j)){
					spotPanels[i][j].setBackground(Color.CYAN);
					spotLabels[i][j].setForeground(Color.CYAN);
				}
				else{
					spotPanels[i][j].setBackground(Color.GRAY);
					spotLabels[i][j].setForeground(Color.GRAY);
				}
				//spotPanels[i][j].setPreferredSize(new Dimension(10,10));
				spotPanels[i][j].add(spotLabels[i][j], BorderLayout.CENTER);
			}
		}
		
		//Set default color for wall spaces.
		for(int i = 0; i < xDimension; i++){
			for(int j = 0; j < yDimension; j++){
				if(((i % 2) == 0) || ((j % 2) == 0)){ //If either index is even, it's part of a wall.
					spotPanels[i][j].setBackground(Color.black);
					if(i == 0){
						spotLabels[i][j].setText("" + j);
						spotLabels[i][j].setFont(new Font("Dialog", Font.BOLD, 16));
						spotLabels[i][j].setForeground(Color.red);
						if(xDimension > 40){
							spotLabels[i][j].setFont(new Font("Dialog", Font.BOLD, 7));
						}
					}
					else if(j == 0){
						spotLabels[i][j].setText("" + i);
						spotLabels[i][j].setFont(new Font("Dialog", Font.BOLD, 16));
						spotLabels[i][j].setForeground(Color.red);
						if(xDimension > 40){
							spotLabels[i][j].setFont(new Font("Dialog", Font.BOLD, 7));
						}
					}
				}
			}
		}
		
		//Fill in walls:
		Point startPoint, endPoint;
		for(int i = 0; i < chart.getNumberOfWalls(); i++){
			startPoint = chart.getWall(i).getFirstPoint();
			endPoint = chart.getWall(i).getSecondPoint();
			if(startPoint.getX() != endPoint.getX()){
				for(double j = startPoint.getX(); j <= endPoint.getX(); j++){
					spotPanels[(int)j][(int)startPoint.getY()].setBackground(Color.white);
					//spotLabels[(int)j][(int)startPoint.getY()].setForeground(Color.black);
				}
			}
			else{
				for(double j = startPoint.getY(); j <= endPoint.getY(); j++){
					spotPanels[(int)startPoint.getX()][(int)j].setBackground(Color.white);
					//spotLabels[(int)j][(int)startPoint.getY()].setForeground(Color.black);
					
				}
			}
		}
		
		//Let's show special locations:
		for(int i = 0; i < chart.getNumberOfSpecialLocations(); i++){
			for(int j = 0; j < chart.getSpecialLocation(i).getNumberOfPoints(); j++){
				double x = chart.getSpecialLocation(i).getPoint(j).getX();
				double y = chart.getSpecialLocation(i).getPoint(j).getY();
				if(chart.getSpecialLocation(i).getIntegerType() == 4){
					spotPanels[(int)x][(int)y].setBackground(Color.BLUE);
				}
				if(chart.getSpecialLocation(i).getIntegerType() == 5){
					spotPanels[(int)x][(int)y].setBackground(Color.MAGENTA);
				}
				if(chart.getSpecialLocation(i).getIntegerType() == 6){
					spotPanels[(int)x][(int)y].setBackground(Color.YELLOW);
				}
				spotLabels[(int)x][(int)y].setText(chart.getSpecialLocation(i).getStringIdentifier());
				//spotLabels[(int)x][(int)y].setForeground(Color.black);
			}
		}
		
		//Time to mark where the clusters are.
		double currDeskX, currDeskY;
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			currDeskX = chart.getCluster(i).getDesk(0).getPoint().getX();
			currDeskY = chart.getCluster(i).getDesk(0).getPoint().getY();
			spotLabels[(int)currDeskX + 1][(int)currDeskY].setText("" + i);
			spotLabels[(int)currDeskX + 1][(int)currDeskY].setFont(new Font("Dialog", Font.BOLD, 16));
			spotLabels[(int)currDeskX + 1][(int)currDeskY].setForeground(Color.GRAY);
			if(xDimension > 40){
				spotLabels[(int)currDeskX + 1][(int)currDeskY].setFont(new Font("Dialog", Font.BOLD, 7));
			}
		}
		
		c.insets = new Insets(1, 1, 1, 1);
		c.gridx = 0;
		for(int i = 0; i < xDimension; i++){
			for(int j = 0; j < yDimension; j++){
				c.gridy = i;
				c.gridx = j;
				//chartPanel.add(spotPanels[i][j],c);	
				chartPanel.add(spotPanels[i][j]);
			}
		}
		
		Point currDesk;
		for(int i = 0; i < chart.getNumberOfClusters(); i++){ //For each cluster:
			for(int j = 0; j < chart.getCluster(i).getNumberOfDesks(); j++){ //For each desk in the cluster
				if(!chart.getCluster(i).getDesk(j).checkIfOpen()){ //If the desk is occupied:
					currDesk = chart.getCluster(i).getDesk(j).getPoint();
					spotLabels[(int)currDesk.getX()][(int)currDesk.getY()].setText("" + chart.getCluster(i).getDesk(j).getEmployee().getID());
					spotLabels[(int)currDesk.getX()][(int)currDesk.getY()].setForeground(Color.BLACK);
				}
			}
		}
		
		chartFrame.setVisible(true);
		//chartFrame.setSize(500, 500);
		chartFrame.setExtendedState(JFrame.MAXIMIZED_BOTH);
		//chartFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		chartFrame.setLocationRelativeTo(null);
		chartFrame.add(chartPanel);
		chartFrame.addWindowListener(new java.awt.event.WindowAdapter() {
            public void windowClosing(java.awt.event.WindowEvent e) {
                scoreFrame.dispose();
            }
		});
		
		Score score = new Score(chart);
		int chartScore = score.computeScoreOutOf100();
		scoreFrame = new JFrame("Score");
		JPanel scorePanel = new JPanel(new GridBagLayout());
		scorePanel.setBackground(Color.black);
		JLabel scoreLabel = new JLabel("" + chartScore + " out of 100");
		JLabel clusterScoreLabel = new JLabel("Clusters: " + score.getClusterAverage());
		JLabel employeeScoreLabel = new JLabel("Employees: " + score.getEmployeeAverage());
		scoreLabel.setFont(new Font("Dialog", Font.BOLD, 25));
		scoreLabel.setForeground(Color.white);
		employeeScoreLabel.setFont(new Font("Dialog", Font.BOLD, 25));
		employeeScoreLabel.setForeground(Color.white);
		clusterScoreLabel.setFont(new Font("Dialog", Font.BOLD, 25));
		clusterScoreLabel.setForeground(Color.white);
		JLabel scoreTitle = new JLabel("Score:");
		scoreTitle.setFont(new Font("Dialog", Font.BOLD, 25));
		scoreTitle.setForeground(Color.white);
		c.gridx = 0;
		c.gridy = 0;
		scorePanel.add(scoreTitle, c);
		c.gridy = 1;
		scorePanel.add(scoreLabel, c);
		c.gridy = 2;
		scorePanel.add(employeeScoreLabel,c);
		c.gridy = 3;
		scorePanel.add(clusterScoreLabel,c);
		scoreFrame.setVisible(true);
		scoreFrame.setSize(300,300);
		scoreFrame.add(scorePanel);
	}
	
	public static void main(String[] args) throws FileNotFoundException{
		Display d = new Display();
		//alg.Algorithm();
	}
}

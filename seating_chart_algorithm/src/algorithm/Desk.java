package algorithm;

public class Desk {
	private Point point;
	private Employee employee;
	private boolean open;
	
	public Desk(int x, int y){
		point = new Point(x, y);
		open = true;
	}
	
	public Desk(Point p){
		point = p;
		open = true;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
		open = false;
	}

	public Point getPoint() {
		return point;
	}

	public void setPoint(Point point) {
		this.point = point;
	}
	
	public boolean checkIfOpen(){
		return open;
	}
}

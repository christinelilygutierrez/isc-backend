package algorithm;

class Desk {
	private Point point;
	private Employee employee;
	private boolean open;
	
	Desk(int x, int y){
		point = new Point(x, y);
		open = true;
	}
	
	Desk(Point p){
		point = p;
		open = true;
	}

	Employee getEmployee() {
		return employee;
	}

	void setEmployee(Employee employee) {
		this.employee = employee;
		open = false;
	}

	Point getPoint() {
		return point;
	}

	void setPoint(Point point) {
		this.point = point;
	}
	
	boolean checkIfOpen(){
		return open;
	}
}

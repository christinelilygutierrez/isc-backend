import java.io.File;
import java.io.FileNotFoundException;

import algorithm.*;

public class CapstoneTesting {

	public static void main(String[] args) {
		String fileName1 = args[0];
		String fileName2 = args[1];
		String fileName3 = args[2];
		
		Alg alg = new Alg();
		try {
			alg.Algorithm(new File(fileName1), new File(fileName2), new File(fileName3), false, false, true, true);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

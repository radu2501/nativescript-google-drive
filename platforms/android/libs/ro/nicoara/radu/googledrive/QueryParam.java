package ro.nicoara.radu.googledrive;

public class QueryParam {
	public String key;
	public String value;
	public String operator;
	
	public QueryParam(String key, String value, String operator) {
		this.key = key;
		this.value = value;
		this.operator = operator;
	}
}
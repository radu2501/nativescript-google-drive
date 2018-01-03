package ro.nicoara.radu.googledrive;
import com.google.api.client.googleapis.extensions.android.gms.auth.UserRecoverableAuthIOException;

public class GApiException extends Exception {
	private Exception nested;
	
	public GApiException(Exception nested) {
		super(nested.getMessage());
		this.nested = nested;
	}
	
	public Exception getCause() {
		return this.nested;
	}
	
	public String getNestedMessage() {
		return this.nested.getMessage();
	}
	
	public boolean isTransientAuthError() {
		return this.nested instanceof UserRecoverableAuthIOException;
	}
}
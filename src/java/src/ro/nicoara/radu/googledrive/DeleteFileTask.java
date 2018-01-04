package ro.nicoara.radu.googledrive;

import com.google.api.services.drive.Drive;

public class DeleteFileTask extends BaseTask {
	private Drive service;
	private String googleId;
	
	public DeleteFileTask(Drive service, String googleId, OnCompleteCallback callback) {
		super(callback);
		this.service = service;
		this.googleId = googleId;
	}
	
	@Override
	public Object doInBackground() {
		try {
			this.service.files().delete(googleId).execute();
			return true;
		} catch (Exception e) {
			return this.getGapiException(e);
		}
	}

}

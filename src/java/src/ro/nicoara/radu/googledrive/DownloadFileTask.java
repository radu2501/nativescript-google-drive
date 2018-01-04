package ro.nicoara.radu.googledrive;

import java.io.IOException;
import java.io.OutputStream;

import com.google.api.services.drive.Drive;

public class DownloadFileTask extends BaseTask {
	private String googleId;
	private Drive service;
	private OutputStream output;
	
	public DownloadFileTask(Drive service, String googleId, OutputStream output, OnCompleteCallback callback) {
		super(callback);
		this.service = service;
		this.googleId = googleId;
		this.output = output;
	}

	@Override
	public Object doInBackground() {
		if (this.service == null) {
			return this.getGapiException(new IOException("No Drive service instance provided."));
		}
		if (this.googleId == null) {
			return this.getGapiException(new IOException("No file id specified."));
		}
		if (this.output == null) {
			return this.getGapiException(new IOException("No outputstream provided."));
		}
		try { 
			this.service.files().get(this.googleId).executeMediaAndDownloadTo(this.output);
			return true;
		} catch (Exception e) {
			return this.getGapiException(e);
		}
	}

}

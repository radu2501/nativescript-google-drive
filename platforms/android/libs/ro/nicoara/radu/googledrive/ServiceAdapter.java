package ro.nicoara.radu.googledrive;

import java.io.ByteArrayOutputStream;

import com.google.api.services.drive.Drive;

public class ServiceAdapter {

	private Drive service;
	
	public ServiceAdapter(Drive service) {
		this.service = service;
	}
	
	public void downloadFileToByteStream(String googleId, ByteArrayOutputStream out, OnCompleteCallback callback) {
		Tasks.downloadFileToByteArrayStream(this.service, googleId, out, callback);
	}
	
}

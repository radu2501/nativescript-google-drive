package ro.nicoara.radu.googledrive;

import com.google.api.services.drive.model.File;

import java.util.Collections;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;

public class UploadFileTask extends BaseTask {
	private String path;
	private Drive service;
	private String mimeType;
	private String parent;
	
	public UploadFileTask(String path, String parent, Drive service, OnCompleteCallback callback) {
		super(callback);
		this.path = path;
		this.service = service;
		this.callback = callback;
		this.parent = parent;
	}

	@Override
	public Object doInBackground() {
		String type = this.mimeType;
		if (type == null) {
			type = "application/*";
		}
		java.io.File osFile = new java.io.File(this.path);
		FileContent mediaContent = new FileContent(type, osFile);
		File toUpload = new File();
		toUpload.setName(osFile.getName());
		toUpload.setParents(Collections.singletonList(this.parent));
		
		try {
			File file = this.service.files().create(toUpload, mediaContent).setFields("id").execute();
			return file.getId();
		} catch (Exception e) {
			return this.getGapiException(e);
		}
	}
	
	public UploadFileTask mimeType(String mimeType) {
		this.mimeType = mimeType;
		return this;
	}

}

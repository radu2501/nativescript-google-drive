package ro.nicoara.radu.googledrive;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;

public class CreateFileTask extends BaseTask {
	private Drive service;
	private String fileName, mimeType;
	
	public CreateFileTask(Drive service, String fileName, String mimeType, OnCompleteCallback callback) {
		super(callback);
		this.service = service;
		this.fileName = fileName;
		this.mimeType = mimeType;
	}

	@Override
	public Object doInBackground() {
		try {
			File meta = new File();
			meta.setName(this.fileName);
			meta.setMimeType(this.mimeType);
			return this.service.files().create(meta).setFields("id").execute().getId();
		} catch (Exception e) {
			return this.getGapiException(e);
		}
	}

}

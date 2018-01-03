package ro.nicoara.radu.googledrive;
import java.io.IOException;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.Drive.Files.List;

public class ListDirectoryTask extends BaseTask {
	private Drive service;
	private QueryParam[] params;
	
	public ListDirectoryTask(Drive service, QueryParam[] params, OnCompleteCallback callback) {
		super(callback);
		this.service = service;
		this.params = params;
	}
	
	public ListDirectoryTask(Drive service, OnCompleteCallback callback) {
		this(service, null, callback);
	}
	
	private List buildRequest() throws IOException {
		List list = this.service.files().list();
		if (this.params != null && params.length > 0) {
			String q = "";
			for (QueryParam param : this.params) {
				String pStr = String.format("%s %s %s", param.key, param.operator, param.value);
				if (q.length() > 0) {
					pStr = " AND " + pStr;
				}
				q += pStr;
			}
			list = list.setQ(q);
		}
		list.setFields("files(id, name)");
		return list;
	}
	
	@Override
	public Object doInBackground() {
		try {
			return this.buildRequest().execute().getFiles();
		} catch (IOException e) {
			return this.getGapiException(e);
		}
	}

}

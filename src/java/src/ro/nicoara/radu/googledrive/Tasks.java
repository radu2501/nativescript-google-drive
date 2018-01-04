package ro.nicoara.radu.googledrive;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

import com.google.api.services.drive.Drive;

public class Tasks {

	public static void listFiles(final Drive service, final QueryParam[] queryParams,
			final OnCompleteCallback callback) {
		final android.os.Handler mHandler = new android.os.Handler();
		ThreadPool.getPool().execute(new Runnable() {

			@Override
			public void run() {
				final ListDirectoryTask task = new ListDirectoryTask(service, queryParams, callback);
				final Object result = task.doInBackground();
				mHandler.post(new Runnable() {

					@Override
					public void run() {
						if (result instanceof GApiException) {
							callback.onError((GApiException) result);
						} else {
							callback.onComplete(result);
						}
					}
				});
			}
		});
	}

	public static void uploadFile(final Drive service, final String path, final String parent, final String mimeType,
			final OnCompleteCallback callback) {
		final android.os.Handler mHandler = new android.os.Handler();

		ThreadPool.getPool().execute(new Runnable() {

			@Override
			public void run() {
				final UploadFileTask task = new UploadFileTask(path, parent, service, callback);
				if (mimeType != null) {
					task.mimeType(mimeType);
				}
				final Object result = task.doInBackground();
				mHandler.post(new Runnable() {

					@Override
					public void run() {
						if (result instanceof GApiException) {
							callback.onError((GApiException) result);
						} else {
							callback.onComplete(result);
						}
					}
				});
			}
		});
	}

	public static void uploadFile(final Drive service, final String path, final OnCompleteCallback callback) {
		uploadFile(service, path, "appDataFolder", null, callback);
	}

	public static void downloadFile(final Drive service, final String googleId, final String output,
			final OnCompleteCallback callback) {
		final FileOutputStream outStream;
		try {
			outStream = new FileOutputStream(new File(output));
		} catch (FileNotFoundException e) {
			callback.onError(new GApiException(e));
			return;
		}
		final android.os.Handler mHandler = new android.os.Handler();

		ThreadPool.getPool().execute(new Runnable() {

			@Override
			public void run() {
				final DownloadFileTask task = new DownloadFileTask(service, googleId, outStream, callback);
				final Object result = task.doInBackground();
				mHandler.post(new Runnable() {
					@Override
					public void run() {
						if (result instanceof GApiException) {
							callback.onError((GApiException) result);
						} else {
							callback.onComplete(result);
						}
					}
				});
			}
		});

	}
	
	public static void downloadFileToByteArrayStream(final Drive service, final String googleId, final ByteArrayOutputStream outStream, final OnCompleteCallback callback) {
		final android.os.Handler mHandler = new android.os.Handler();

		ThreadPool.getPool().execute(new Runnable() {

			@Override
			public void run() {
				final DownloadFileTask task = new DownloadFileTask(service, googleId, outStream, callback);
				final Object result = task.doInBackground();
				mHandler.post(new Runnable() {
					@Override
					public void run() {
						if (result instanceof GApiException) {
							callback.onError((GApiException) result);
						} else {
							callback.onComplete(result);
						}
					}
				});
			}
		});
	}
	
	public static void createFile(final Drive service, final String fileName, final String mimeType, final OnCompleteCallback callback) {
		final android.os.Handler mHandler = new android.os.Handler();
		
		ThreadPool.getPool().execute(new Runnable() {
			
			@Override
			public void run() {
				final CreateFileTask createTask = new CreateFileTask(service, fileName, mimeType, callback);
				final Object result = createTask.doInBackground();
				mHandler.post(new Runnable() {
					@Override
					public void run() {
						if (result instanceof GApiException) {
							callback.onError((GApiException) result);
						} else {
							callback.onComplete(result);
						}
					}
				});
			}
		});
	}
	
	public static void deleteFile(final Drive service, final String googleId, final OnCompleteCallback callback) {
final android.os.Handler mHandler = new android.os.Handler();
		
		ThreadPool.getPool().execute(new Runnable() {
			
			@Override
			public void run() {
				final DeleteFileTask deleteTask = new DeleteFileTask(service, googleId, callback);
				final Object result = deleteTask.doInBackground();
				mHandler.post(new Runnable() {
					@Override
					public void run() {
						if (result instanceof GApiException) {
							callback.onError((GApiException) result);
						} else {
							callback.onComplete(result);
						}
					}
				});
			}
		});
	}
}

package ro.nicoara.radu.googledrive;

public interface OnCompleteCallback {
	void onComplete(Object result);
	void onError(GApiException exception);
}

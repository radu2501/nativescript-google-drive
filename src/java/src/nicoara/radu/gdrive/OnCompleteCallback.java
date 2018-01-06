package nicoara.radu.gdrive;

public interface OnCompleteCallback {
	void onComplete(Object result);
	void onError(GApiException exception);
}

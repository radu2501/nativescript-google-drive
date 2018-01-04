package ro.nicoara.radu.googledrive;

public abstract class BaseTask {
	protected OnCompleteCallback callback;
	protected Object result;
	
	public BaseTask(OnCompleteCallback callback) {
		this.callback = callback;
	}
	
	public abstract Object doInBackground();
	
	protected GApiException getGapiException(Exception original) {
		return new GApiException(original);
	}
	
	public void execute() {
		this.result = this.doInBackground();
		this.callback.onComplete(this.result);
	}
}

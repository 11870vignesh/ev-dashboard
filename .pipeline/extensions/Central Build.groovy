import static com.sap.piper.internal.Prerequisites.checkScript

void call(Map params) {

	params.originalStage()
	unstash 'buildResult'
  	sh "ls"

}
return this

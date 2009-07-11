/**
 * Appcelerator Titanium - licensed under the Apache Public License 2
 * see LICENSE in the root folder for details on the license.
 * Copyright (c) 2009 Appcelerator, Inc. All Rights Reserved.
 */

#ifndef _OSX_PROCESS_H_
#define _OSX_PROCESS_H_
#include <kroll/kroll.h>
#include <Cocoa/Cocoa.h>
#include "../process_binding.h"
#include "../process.h"
#include "osx_input_pipe.h"
#include "osx_output_pipe.h"
#include <signal.h>

namespace ti { class OSXProcess; }

@interface TiOSXProcess : NSObject {
	NSTask *task;
	ti::OSXProcess *process;
}

-(id)initWithProcess:(ti::OSXProcess*)p;
-(NSTask*)task;
-(void)terminated:(NSNotification *)aNotification;
@end

namespace ti
{
	class OSXProcess : public Process
	{
	public:
		static AutoProcess GetCurrentProcess();
		OSXProcess(SharedKList args, SharedKObject environment, AutoOutputPipe stdin, AutoInputPipe stdout, AutoInputPipe stderr);
		virtual ~OSXProcess();
		
		virtual int GetPID();
		virtual void Launch(bool async=true);
		virtual void Terminate();
		virtual void Kill();
		virtual void SendSignal(int signal);
		virtual void Restart();
		virtual void Restart(SharedKObject env, AutoOutputPipe stdin, AutoInputPipe stdout, AutoInputPipe stderr);
		
		AutoPtr<OSXOutputPipe> GetStdin() { return stdin.cast<OSXOutputPipe>(); }
		AutoPtr<OSXInputPipe> GetStdout() { return stdout.cast<OSXInputPipe>(); }
		AutoPtr<OSXInputPipe> GetStderr() { return stderr.cast<OSXInputPipe>(); }
	protected:
		TiOSXProcess *delegate;
		NSProcessInfo *currentProcessInfo;
		OSXProcess::OSXProcess(NSProcessInfo *processInfo);
		
		static AutoPtr<OSXProcess> currentProcess;
	};
}

#endif

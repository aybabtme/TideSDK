/**
* This file has been modified from its orginal sources.
*
* Copyright (c) 2012 Software in the Public Interest Inc (SPI)
* Copyright (c) 2012 David Pratt
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
***
* Copyright (c) 2008-2012 Appcelerator Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

#ifndef _FUNCTION_PTR_METHOD_H_
#define _FUNCTION_PTR_METHOD_H_

namespace tide
{
    typedef ValueRef (*KFunctionPtrCallback) (const ValueList& args);
    class TIDE_API FunctionPtrMethod : public TiMethod
    {
        public:
        FunctionPtrMethod(KFunctionPtrCallback);
        virtual ~FunctionPtrMethod();

        /**
         * @see TiMethod::Call
         */
        virtual ValueRef Call(const ValueList& args);

        /**
         * @see TiObject::Set
         */
        virtual void Set(const char *name, ValueRef value);

        /**
         * @see TiObject::Get
         */
        virtual ValueRef Get(const char *name);

        /**
         * @see TiObject::GetPropertyNames
         */
        virtual SharedStringList GetPropertyNames();
        

        protected:
        KFunctionPtrCallback callback;
        TiObjectRef object;

        private:
        DISALLOW_EVIL_CONSTRUCTORS(FunctionPtrMethod);
    };
}

#endif

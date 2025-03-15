"use strict";
(() => {
  // node_modules/@google/generative-ai/dist/index.mjs
  var SchemaType;
  (function(SchemaType2) {
    SchemaType2["STRING"] = "string";
    SchemaType2["NUMBER"] = "number";
    SchemaType2["INTEGER"] = "integer";
    SchemaType2["BOOLEAN"] = "boolean";
    SchemaType2["ARRAY"] = "array";
    SchemaType2["OBJECT"] = "object";
  })(SchemaType || (SchemaType = {}));
  var ExecutableCodeLanguage;
  (function(ExecutableCodeLanguage2) {
    ExecutableCodeLanguage2["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
    ExecutableCodeLanguage2["PYTHON"] = "python";
  })(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
  var Outcome;
  (function(Outcome2) {
    Outcome2["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
    Outcome2["OUTCOME_OK"] = "outcome_ok";
    Outcome2["OUTCOME_FAILED"] = "outcome_failed";
    Outcome2["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
  })(Outcome || (Outcome = {}));
  var POSSIBLE_ROLES = ["user", "model", "function", "system"];
  var HarmCategory;
  (function(HarmCategory2) {
    HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
  })(HarmCategory || (HarmCategory = {}));
  var HarmBlockThreshold;
  (function(HarmBlockThreshold2) {
    HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
  })(HarmBlockThreshold || (HarmBlockThreshold = {}));
  var HarmProbability;
  (function(HarmProbability2) {
    HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
    HarmProbability2["LOW"] = "LOW";
    HarmProbability2["MEDIUM"] = "MEDIUM";
    HarmProbability2["HIGH"] = "HIGH";
  })(HarmProbability || (HarmProbability = {}));
  var BlockReason;
  (function(BlockReason2) {
    BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    BlockReason2["SAFETY"] = "SAFETY";
    BlockReason2["OTHER"] = "OTHER";
  })(BlockReason || (BlockReason = {}));
  var FinishReason;
  (function(FinishReason2) {
    FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    FinishReason2["STOP"] = "STOP";
    FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
    FinishReason2["SAFETY"] = "SAFETY";
    FinishReason2["RECITATION"] = "RECITATION";
    FinishReason2["LANGUAGE"] = "LANGUAGE";
    FinishReason2["OTHER"] = "OTHER";
  })(FinishReason || (FinishReason = {}));
  var TaskType;
  (function(TaskType2) {
    TaskType2["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
    TaskType2["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
    TaskType2["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
    TaskType2["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
    TaskType2["CLASSIFICATION"] = "CLASSIFICATION";
    TaskType2["CLUSTERING"] = "CLUSTERING";
  })(TaskType || (TaskType = {}));
  var FunctionCallingMode;
  (function(FunctionCallingMode2) {
    FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    FunctionCallingMode2["AUTO"] = "AUTO";
    FunctionCallingMode2["ANY"] = "ANY";
    FunctionCallingMode2["NONE"] = "NONE";
  })(FunctionCallingMode || (FunctionCallingMode = {}));
  var DynamicRetrievalMode;
  (function(DynamicRetrievalMode2) {
    DynamicRetrievalMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    DynamicRetrievalMode2["MODE_DYNAMIC"] = "MODE_DYNAMIC";
  })(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
  var GoogleGenerativeAIError = class extends Error {
    constructor(message) {
      super(`[GoogleGenerativeAI Error]: ${message}`);
    }
  };
  var GoogleGenerativeAIResponseError = class extends GoogleGenerativeAIError {
    constructor(message, response) {
      super(message);
      this.response = response;
    }
  };
  var GoogleGenerativeAIFetchError = class extends GoogleGenerativeAIError {
    constructor(message, status, statusText, errorDetails) {
      super(message);
      this.status = status;
      this.statusText = statusText;
      this.errorDetails = errorDetails;
    }
  };
  var GoogleGenerativeAIRequestInputError = class extends GoogleGenerativeAIError {
  };
  var DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
  var DEFAULT_API_VERSION = "v1beta";
  var PACKAGE_VERSION = "0.21.0";
  var PACKAGE_LOG_HEADER = "genai-js";
  var Task;
  (function(Task2) {
    Task2["GENERATE_CONTENT"] = "generateContent";
    Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
    Task2["COUNT_TOKENS"] = "countTokens";
    Task2["EMBED_CONTENT"] = "embedContent";
    Task2["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
  })(Task || (Task = {}));
  var RequestUrl = class {
    constructor(model2, task, apiKey, stream, requestOptions) {
      this.model = model2;
      this.task = task;
      this.apiKey = apiKey;
      this.stream = stream;
      this.requestOptions = requestOptions;
    }
    toString() {
      var _a, _b;
      const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
      const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
      let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
      if (this.stream) {
        url += "?alt=sse";
      }
      return url;
    }
  };
  function getClientHeaders(requestOptions) {
    const clientHeaders = [];
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
      clientHeaders.push(requestOptions.apiClient);
    }
    clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
    return clientHeaders.join(" ");
  }
  async function getHeaders(url) {
    var _a;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
    headers.append("x-goog-api-key", url.apiKey);
    let customHeaders = (_a = url.requestOptions) === null || _a === void 0 ? void 0 : _a.customHeaders;
    if (customHeaders) {
      if (!(customHeaders instanceof Headers)) {
        try {
          customHeaders = new Headers(customHeaders);
        } catch (e) {
          throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
        }
      }
      for (const [headerName, headerValue] of customHeaders.entries()) {
        if (headerName === "x-goog-api-key") {
          throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
        } else if (headerName === "x-goog-api-client") {
          throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
        }
        headers.append(headerName, headerValue);
      }
    }
    return headers;
  }
  async function constructModelRequest(model2, task, apiKey, stream, body, requestOptions) {
    const url = new RequestUrl(model2, task, apiKey, stream, requestOptions);
    return {
      url: url.toString(),
      fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: await getHeaders(url), body })
    };
  }
  async function makeModelRequest(model2, task, apiKey, stream, body, requestOptions = {}, fetchFn = fetch) {
    const { url, fetchOptions } = await constructModelRequest(model2, task, apiKey, stream, body, requestOptions);
    return makeRequest(url, fetchOptions, fetchFn);
  }
  async function makeRequest(url, fetchOptions, fetchFn = fetch) {
    let response;
    try {
      response = await fetchFn(url, fetchOptions);
    } catch (e) {
      handleResponseError(e, url);
    }
    if (!response.ok) {
      await handleResponseNotOk(response, url);
    }
    return response;
  }
  function handleResponseError(e, url) {
    let err = e;
    if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
      err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
      err.stack = e.stack;
    }
    throw err;
  }
  async function handleResponseNotOk(response, url) {
    let message = "";
    let errorDetails;
    try {
      const json = await response.json();
      message = json.error.message;
      if (json.error.details) {
        message += ` ${JSON.stringify(json.error.details)}`;
        errorDetails = json.error.details;
      }
    } catch (e) {
    }
    throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
  }
  function buildFetchOptions(requestOptions) {
    const fetchOptions = {};
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== void 0 || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
      const controller = new AbortController();
      if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
        setTimeout(() => controller.abort(), requestOptions.timeout);
      }
      if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
        requestOptions.signal.addEventListener("abort", () => {
          controller.abort();
        });
      }
      fetchOptions.signal = controller.signal;
    }
    return fetchOptions;
  }
  function addHelpers(response) {
    response.text = () => {
      if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
          console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
          throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
        }
        return getText(response);
      } else if (response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
      }
      return "";
    };
    response.functionCall = () => {
      if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
          console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
          throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
        }
        console.warn(`response.functionCall() is deprecated. Use response.functionCalls() instead.`);
        return getFunctionCalls(response)[0];
      } else if (response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
      }
      return void 0;
    };
    response.functionCalls = () => {
      if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
          console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
          throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
        }
        return getFunctionCalls(response);
      } else if (response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
      }
      return void 0;
    };
    return response;
  }
  function getText(response) {
    var _a, _b, _c, _d;
    const textStrings = [];
    if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
      for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
        if (part.text) {
          textStrings.push(part.text);
        }
        if (part.executableCode) {
          textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
        }
        if (part.codeExecutionResult) {
          textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
        }
      }
    }
    if (textStrings.length > 0) {
      return textStrings.join("");
    } else {
      return "";
    }
  }
  function getFunctionCalls(response) {
    var _a, _b, _c, _d;
    const functionCalls = [];
    if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
      for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
        if (part.functionCall) {
          functionCalls.push(part.functionCall);
        }
      }
    }
    if (functionCalls.length > 0) {
      return functionCalls;
    } else {
      return void 0;
    }
  }
  var badFinishReasons = [
    FinishReason.RECITATION,
    FinishReason.SAFETY,
    FinishReason.LANGUAGE
  ];
  function hadBadFinishReason(candidate) {
    return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
  }
  function formatBlockErrorMessage(response) {
    var _a, _b, _c;
    let message = "";
    if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
      message += "Response was blocked";
      if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
        message += ` due to ${response.promptFeedback.blockReason}`;
      }
      if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
        message += `: ${response.promptFeedback.blockReasonMessage}`;
      }
    } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
      const firstCandidate = response.candidates[0];
      if (hadBadFinishReason(firstCandidate)) {
        message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
        if (firstCandidate.finishMessage) {
          message += `: ${firstCandidate.finishMessage}`;
        }
      }
    }
    return message;
  }
  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n])
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  }
  var responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
  function processStream(response) {
    const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
    const responseStream = getResponseStream(inputStream);
    const [stream1, stream2] = responseStream.tee();
    return {
      stream: generateResponseSequence(stream1),
      response: getResponsePromise(stream2)
    };
  }
  async function getResponsePromise(stream) {
    const allResponses = [];
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return addHelpers(aggregateResponses(allResponses));
      }
      allResponses.push(value);
    }
  }
  function generateResponseSequence(stream) {
    return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
      const reader = stream.getReader();
      while (true) {
        const { value, done } = yield __await(reader.read());
        if (done) {
          break;
        }
        yield yield __await(addHelpers(value));
      }
    });
  }
  function getResponseStream(inputStream) {
    const reader = inputStream.getReader();
    const stream = new ReadableStream({
      start(controller) {
        let currentText = "";
        return pump();
        function pump() {
          return reader.read().then(({ value, done }) => {
            if (done) {
              if (currentText.trim()) {
                controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
                return;
              }
              controller.close();
              return;
            }
            currentText += value;
            let match = currentText.match(responseLineRE);
            let parsedResponse;
            while (match) {
              try {
                parsedResponse = JSON.parse(match[1]);
              } catch (e) {
                controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
                return;
              }
              controller.enqueue(parsedResponse);
              currentText = currentText.substring(match[0].length);
              match = currentText.match(responseLineRE);
            }
            return pump();
          });
        }
      }
    });
    return stream;
  }
  function aggregateResponses(responses) {
    const lastResponse = responses[responses.length - 1];
    const aggregatedResponse = {
      promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
    };
    for (const response of responses) {
      if (response.candidates) {
        for (const candidate of response.candidates) {
          const i = candidate.index;
          if (!aggregatedResponse.candidates) {
            aggregatedResponse.candidates = [];
          }
          if (!aggregatedResponse.candidates[i]) {
            aggregatedResponse.candidates[i] = {
              index: candidate.index
            };
          }
          aggregatedResponse.candidates[i].citationMetadata = candidate.citationMetadata;
          aggregatedResponse.candidates[i].groundingMetadata = candidate.groundingMetadata;
          aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
          aggregatedResponse.candidates[i].finishMessage = candidate.finishMessage;
          aggregatedResponse.candidates[i].safetyRatings = candidate.safetyRatings;
          if (candidate.content && candidate.content.parts) {
            if (!aggregatedResponse.candidates[i].content) {
              aggregatedResponse.candidates[i].content = {
                role: candidate.content.role || "user",
                parts: []
              };
            }
            const newPart = {};
            for (const part of candidate.content.parts) {
              if (part.text) {
                newPart.text = part.text;
              }
              if (part.functionCall) {
                newPart.functionCall = part.functionCall;
              }
              if (part.executableCode) {
                newPart.executableCode = part.executableCode;
              }
              if (part.codeExecutionResult) {
                newPart.codeExecutionResult = part.codeExecutionResult;
              }
              if (Object.keys(newPart).length === 0) {
                newPart.text = "";
              }
              aggregatedResponse.candidates[i].content.parts.push(newPart);
            }
          }
        }
      }
      if (response.usageMetadata) {
        aggregatedResponse.usageMetadata = response.usageMetadata;
      }
    }
    return aggregatedResponse;
  }
  async function generateContentStream(apiKey, model2, params, requestOptions) {
    const response = await makeModelRequest(
      model2,
      Task.STREAM_GENERATE_CONTENT,
      apiKey,
      /* stream */
      true,
      JSON.stringify(params),
      requestOptions
    );
    return processStream(response);
  }
  async function generateContent(apiKey, model2, params, requestOptions) {
    const response = await makeModelRequest(
      model2,
      Task.GENERATE_CONTENT,
      apiKey,
      /* stream */
      false,
      JSON.stringify(params),
      requestOptions
    );
    const responseJson = await response.json();
    const enhancedResponse = addHelpers(responseJson);
    return {
      response: enhancedResponse
    };
  }
  function formatSystemInstruction(input) {
    if (input == null) {
      return void 0;
    } else if (typeof input === "string") {
      return { role: "system", parts: [{ text: input }] };
    } else if (input.text) {
      return { role: "system", parts: [input] };
    } else if (input.parts) {
      if (!input.role) {
        return { role: "system", parts: input.parts };
      } else {
        return input;
      }
    }
  }
  function formatNewContent(request) {
    let newParts = [];
    if (typeof request === "string") {
      newParts = [{ text: request }];
    } else {
      for (const partOrString of request) {
        if (typeof partOrString === "string") {
          newParts.push({ text: partOrString });
        } else {
          newParts.push(partOrString);
        }
      }
    }
    return assignRoleToPartsAndValidateSendMessageRequest(newParts);
  }
  function assignRoleToPartsAndValidateSendMessageRequest(parts) {
    const userContent = { role: "user", parts: [] };
    const functionContent = { role: "function", parts: [] };
    let hasUserContent = false;
    let hasFunctionContent = false;
    for (const part of parts) {
      if ("functionResponse" in part) {
        functionContent.parts.push(part);
        hasFunctionContent = true;
      } else {
        userContent.parts.push(part);
        hasUserContent = true;
      }
    }
    if (hasUserContent && hasFunctionContent) {
      throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
    }
    if (!hasUserContent && !hasFunctionContent) {
      throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
    }
    if (hasUserContent) {
      return userContent;
    }
    return functionContent;
  }
  function formatCountTokensInput(params, modelParams) {
    var _a;
    let formattedGenerateContentRequest = {
      model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
      generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
      safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
      tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
      toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
      systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
      cachedContent: (_a = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a === void 0 ? void 0 : _a.name,
      contents: []
    };
    const containsGenerateContentRequest = params.generateContentRequest != null;
    if (params.contents) {
      if (containsGenerateContentRequest) {
        throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
      }
      formattedGenerateContentRequest.contents = params.contents;
    } else if (containsGenerateContentRequest) {
      formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
    } else {
      const content = formatNewContent(params);
      formattedGenerateContentRequest.contents = [content];
    }
    return { generateContentRequest: formattedGenerateContentRequest };
  }
  function formatGenerateContentInput(params) {
    let formattedRequest;
    if (params.contents) {
      formattedRequest = params;
    } else {
      const content = formatNewContent(params);
      formattedRequest = { contents: [content] };
    }
    if (params.systemInstruction) {
      formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
    }
    return formattedRequest;
  }
  function formatEmbedContentInput(params) {
    if (typeof params === "string" || Array.isArray(params)) {
      const content = formatNewContent(params);
      return { content };
    }
    return params;
  }
  var VALID_PART_FIELDS = [
    "text",
    "inlineData",
    "functionCall",
    "functionResponse",
    "executableCode",
    "codeExecutionResult"
  ];
  var VALID_PARTS_PER_ROLE = {
    user: ["text", "inlineData"],
    function: ["functionResponse"],
    model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
    // System instructions shouldn't be in history anyway.
    system: ["text"]
  };
  function validateChatHistory(history) {
    let prevContent = false;
    for (const currContent of history) {
      const { role, parts } = currContent;
      if (!prevContent && role !== "user") {
        throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
      }
      if (!POSSIBLE_ROLES.includes(role)) {
        throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
      }
      if (!Array.isArray(parts)) {
        throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
      }
      if (parts.length === 0) {
        throw new GoogleGenerativeAIError("Each Content should have at least one part");
      }
      const countFields = {
        text: 0,
        inlineData: 0,
        functionCall: 0,
        functionResponse: 0,
        fileData: 0,
        executableCode: 0,
        codeExecutionResult: 0
      };
      for (const part of parts) {
        for (const key of VALID_PART_FIELDS) {
          if (key in part) {
            countFields[key] += 1;
          }
        }
      }
      const validParts = VALID_PARTS_PER_ROLE[role];
      for (const key of VALID_PART_FIELDS) {
        if (!validParts.includes(key) && countFields[key] > 0) {
          throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
        }
      }
      prevContent = true;
    }
  }
  var SILENT_ERROR = "SILENT_ERROR";
  var ChatSession = class {
    constructor(apiKey, model2, params, _requestOptions = {}) {
      this.model = model2;
      this.params = params;
      this._requestOptions = _requestOptions;
      this._history = [];
      this._sendPromise = Promise.resolve();
      this._apiKey = apiKey;
      if (params === null || params === void 0 ? void 0 : params.history) {
        validateChatHistory(params.history);
        this._history = params.history;
      }
    }
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Blocked candidates are not added to history, nor are the prompts that
     * generated them.
     */
    async getHistory() {
      await this._sendPromise;
      return this._history;
    }
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async sendMessage(request, requestOptions = {}) {
      var _a, _b, _c, _d, _e, _f;
      await this._sendPromise;
      const newContent = formatNewContent(request);
      const generateContentRequest = {
        safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
        generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
        tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
        toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
        systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
        cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
        contents: [...this._history, newContent]
      };
      const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      let finalResult;
      this._sendPromise = this._sendPromise.then(() => generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result) => {
        var _a2;
        if (result.response.candidates && result.response.candidates.length > 0) {
          this._history.push(newContent);
          const responseContent = Object.assign({
            parts: [],
            // Response seems to come back without a role set.
            role: "model"
          }, (_a2 = result.response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content);
          this._history.push(responseContent);
        } else {
          const blockErrorMessage = formatBlockErrorMessage(result.response);
          if (blockErrorMessage) {
            console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
          }
        }
        finalResult = result;
      });
      await this._sendPromise;
      return finalResult;
    }
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async sendMessageStream(request, requestOptions = {}) {
      var _a, _b, _c, _d, _e, _f;
      await this._sendPromise;
      const newContent = formatNewContent(request);
      const generateContentRequest = {
        safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
        generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
        tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
        toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
        systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
        cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
        contents: [...this._history, newContent]
      };
      const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
      this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
        throw new Error(SILENT_ERROR);
      }).then((streamResult) => streamResult.response).then((response) => {
        if (response.candidates && response.candidates.length > 0) {
          this._history.push(newContent);
          const responseContent = Object.assign({}, response.candidates[0].content);
          if (!responseContent.role) {
            responseContent.role = "model";
          }
          this._history.push(responseContent);
        } else {
          const blockErrorMessage = formatBlockErrorMessage(response);
          if (blockErrorMessage) {
            console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
          }
        }
      }).catch((e) => {
        if (e.message !== SILENT_ERROR) {
          console.error(e);
        }
      });
      return streamPromise;
    }
  };
  async function countTokens(apiKey, model2, params, singleRequestOptions) {
    const response = await makeModelRequest(model2, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
    return response.json();
  }
  async function embedContent(apiKey, model2, params, requestOptions) {
    const response = await makeModelRequest(model2, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
    return response.json();
  }
  async function batchEmbedContents(apiKey, model2, params, requestOptions) {
    const requestsWithModel = params.requests.map((request) => {
      return Object.assign(Object.assign({}, request), { model: model2 });
    });
    const response = await makeModelRequest(model2, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({ requests: requestsWithModel }), requestOptions);
    return response.json();
  }
  var GenerativeModel = class {
    constructor(apiKey, modelParams, _requestOptions = {}) {
      this.apiKey = apiKey;
      this._requestOptions = _requestOptions;
      if (modelParams.model.includes("/")) {
        this.model = modelParams.model;
      } else {
        this.model = `models/${modelParams.model}`;
      }
      this.generationConfig = modelParams.generationConfig || {};
      this.safetySettings = modelParams.safetySettings || [];
      this.tools = modelParams.tools;
      this.toolConfig = modelParams.toolConfig;
      this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
      this.cachedContent = modelParams.cachedContent;
    }
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async generateContent(request, requestOptions = {}) {
      var _a;
      const formattedParams = formatGenerateContentInput(request);
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
    }
    /**
     * Makes a single streaming call to the model and returns an object
     * containing an iterable stream that iterates over all chunks in the
     * streaming response as well as a promise that returns the final
     * aggregated response.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async generateContentStream(request, requestOptions = {}) {
      var _a;
      const formattedParams = formatGenerateContentInput(request);
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
    }
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams) {
      var _a;
      return new ChatSession(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, startChatParams), this._requestOptions);
    }
    /**
     * Counts the tokens in the provided request.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async countTokens(request, requestOptions = {}) {
      const formattedParams = formatCountTokensInput(request, {
        model: this.model,
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
        tools: this.tools,
        toolConfig: this.toolConfig,
        systemInstruction: this.systemInstruction,
        cachedContent: this.cachedContent
      });
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
    }
    /**
     * Embeds the provided content.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async embedContent(request, requestOptions = {}) {
      const formattedParams = formatEmbedContentInput(request);
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
    }
    /**
     * Embeds an array of {@link EmbedContentRequest}s.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
    }
  };
  var GoogleGenerativeAI = class {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }
    /**
     * Gets a {@link GenerativeModel} instance for the provided model name.
     */
    getGenerativeModel(modelParams, requestOptions) {
      if (!modelParams.model) {
        throw new GoogleGenerativeAIError(`Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
      }
      return new GenerativeModel(this.apiKey, modelParams, requestOptions);
    }
    /**
     * Creates a {@link GenerativeModel} instance from provided content cache.
     */
    getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
      if (!cachedContent.name) {
        throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
      }
      if (!cachedContent.model) {
        throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
      }
      const disallowedDuplicates = ["model", "systemInstruction"];
      for (const key of disallowedDuplicates) {
        if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
          if (key === "model") {
            const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
            const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
            if (modelParamsComp === cachedContentComp) {
              continue;
            }
          }
          throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
        }
      }
      const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), { model: cachedContent.model, tools: cachedContent.tools, toolConfig: cachedContent.toolConfig, systemInstruction: cachedContent.systemInstruction, cachedContent });
      return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
    }
  };

  // src/extension/background.ts
  var TRACKING_PATTERNS = {
    analytics: [
      // Basic Analytics
      { pattern: "google-analytics.com", name: "Google Analytics", impact: "high" },
      { pattern: "analytics.js", name: "Generic Analytics", impact: "medium" },
      { pattern: "gtag", name: "Google Tag Manager", impact: "high" },
      { pattern: "googletagmanager.com", name: "Google Tag Manager", impact: "high" },
      { pattern: "tealium.com", name: "Tealium IQ", impact: "high" },
      { pattern: "tealiumiq.com", name: "Tealium IQ", impact: "high" },
      { pattern: "tiqcdn.com", name: "Tealium CDN", impact: "high" },
      { pattern: "segment.com", name: "Segment", impact: "high" },
      { pattern: "mixpanel.com", name: "Mixpanel", impact: "high" },
      { pattern: "statcounter.com", name: "StatCounter", impact: "medium" },
      { pattern: "quantserve.com", name: "Quantcast", impact: "high" },
      { pattern: "chartbeat.com", name: "Chartbeat", impact: "medium" },
      { pattern: "parsely.com", name: "Parse.ly", impact: "medium" },
      { pattern: "newrelic.com", name: "New Relic", impact: "medium" },
      { pattern: "datadog", name: "Datadog RUM", impact: "medium" },
      { pattern: "dynatrace.com", name: "Dynatrace", impact: "medium" },
      { pattern: "comscore.com", name: "ComScore", impact: "high" },
      // Behavior Analytics
      { pattern: "hotjar.com", name: "Hotjar", impact: "high" },
      { pattern: "mouseflow.com", name: "Mouseflow", impact: "high" },
      { pattern: "clarity.ms", name: "Microsoft Clarity", impact: "medium" },
      { pattern: "luckyorange.com", name: "Lucky Orange", impact: "high" },
      { pattern: "crazyegg.com", name: "Crazy Egg", impact: "medium" },
      { pattern: "clicktale.net", name: "Clicktale", impact: "high" },
      { pattern: "inspectlet.com", name: "Inspectlet", impact: "high" },
      { pattern: "heatmap.it", name: "Heatmap", impact: "medium" },
      { pattern: "contentsquare.com", name: "Contentsquare", impact: "high" },
      { pattern: "decibel.com", name: "Decibel Insight", impact: "high" },
      { pattern: "glassbox.com", name: "Glassbox", impact: "high" },
      // Privacy-Focused Analytics
      { pattern: "plausible.io", name: "Plausible Analytics", impact: "low" },
      { pattern: "matomo", name: "Matomo Analytics", impact: "medium" },
      { pattern: "fathom.com", name: "Fathom Analytics", impact: "low" },
      { pattern: "simple.analytics", name: "Simple Analytics", impact: "low" },
      { pattern: "counter.dev", name: "Counter.dev", impact: "low" },
      { pattern: "goatcounter.com", name: "GoatCounter", impact: "low" },
      { pattern: "pirsch.io", name: "Pirsch Analytics", impact: "low" },
      { pattern: "shynet.io", name: "Shynet", impact: "low" },
      // Enterprise Analytics
      { pattern: "amplitude.com", name: "Amplitude", impact: "high" },
      { pattern: "heap.io", name: "Heap Analytics", impact: "high" },
      { pattern: "adobe.com/analytics", name: "Adobe Analytics", impact: "high" },
      { pattern: "omniture", name: "Adobe Analytics (Legacy)", impact: "high" },
      { pattern: "coremetrics.com", name: "IBM Digital Analytics", impact: "high" },
      { pattern: "webtrends.com", name: "Webtrends", impact: "high" },
      { pattern: "pendo.io", name: "Pendo", impact: "high" },
      { pattern: "appsflyer.com", name: "AppsFlyer", impact: "high" },
      { pattern: "adjust.com", name: "Adjust", impact: "high" },
      { pattern: "kochava.com", name: "Kochava", impact: "high" }
    ],
    social_media: [
      // Facebook/Meta
      { pattern: "facebook.com/tr/", name: "Facebook Pixel", impact: "high" },
      { pattern: "connect.facebook.net", name: "Facebook SDK", impact: "high" },
      { pattern: "facebook.com/plugins", name: "Facebook Social Plugins", impact: "medium" },
      { pattern: "graph.facebook.com", name: "Facebook Graph API", impact: "high" },
      { pattern: "facebook.com/audience", name: "Facebook Audience Network", impact: "high" },
      { pattern: "fbsbx.com", name: "Facebook Social Embed", impact: "medium" },
      // Professional Networks
      { pattern: "linkedin.com/px", name: "LinkedIn Insight Tag", impact: "medium" },
      { pattern: "snap.licdn.com", name: "LinkedIn Analytics", impact: "medium" },
      { pattern: "platform.linkedin.com", name: "LinkedIn Platform", impact: "medium" },
      { pattern: "ads.linkedin.com", name: "LinkedIn Ads", impact: "high" },
      { pattern: "licdn.com", name: "LinkedIn Content", impact: "medium" },
      // Other Social Networks
      { pattern: "ads.twitter.com", name: "Twitter Pixel", impact: "medium" },
      { pattern: "static.ads-twitter.com", name: "Twitter Ads", impact: "medium" },
      { pattern: "platform.twitter.com", name: "Twitter Platform", impact: "medium" },
      { pattern: "analytics.twitter.com", name: "Twitter Analytics", impact: "medium" },
      { pattern: "pinterest.com/ct.js", name: "Pinterest Tag", impact: "medium" },
      { pattern: "widgets.pinterest.com", name: "Pinterest Widgets", impact: "medium" },
      { pattern: "instagram.com", name: "Instagram Tracking", impact: "high" },
      { pattern: "tiktok.com", name: "TikTok Pixel", impact: "high" },
      { pattern: "analytics.tiktok.com", name: "TikTok Analytics", impact: "high" },
      { pattern: "snap.com", name: "Snapchat Pixel", impact: "high" },
      { pattern: "sc-static.net", name: "Snapchat Tracking", impact: "high" },
      { pattern: "reddit.com/api", name: "Reddit Tracking", impact: "medium" },
      { pattern: "vk.com", name: "VKontakte Tracking", impact: "medium" },
      { pattern: "weibo.com", name: "Weibo Tracking", impact: "medium" },
      { pattern: "line.me", name: "LINE Tracking", impact: "medium" }
    ],
    ad_networks: [
      // Google Ads
      { pattern: "doubleclick.net", name: "Google Ads", impact: "high" },
      { pattern: "googlesyndication.com", name: "Google AdSense", impact: "high" },
      { pattern: "google-analytics", name: "Google Analytics", impact: "high" },
      { pattern: "googleadservices.com", name: "Google Ad Services", impact: "high" },
      { pattern: "pagead2.googlesyndication", name: "Google PageAds", impact: "high" },
      { pattern: "adsense.google.com", name: "Google AdSense", impact: "high" },
      { pattern: "adwords.google.com", name: "Google Ads", impact: "high" },
      // Major Ad Networks
      { pattern: "adnxs.com", name: "AppNexus", impact: "high" },
      { pattern: "criteo.com", name: "Criteo", impact: "high" },
      { pattern: "criteo.net", name: "Criteo Network", impact: "high" },
      { pattern: "rubiconproject.com", name: "Rubicon Project", impact: "high" },
      { pattern: "pubmatic.com", name: "PubMatic", impact: "high" },
      { pattern: "openx.net", name: "OpenX", impact: "high" },
      { pattern: "casalemedia.com", name: "Casale Media", impact: "high" },
      { pattern: "advertising.com", name: "AOL Advertising", impact: "high" },
      { pattern: "sharethrough.com", name: "Sharethrough", impact: "medium" },
      { pattern: "bidswitch.net", name: "Bidswitch", impact: "high" },
      { pattern: "mediamath.com", name: "MediaMath", impact: "high" },
      { pattern: "contextweb.com", name: "ContextWeb", impact: "high" },
      { pattern: "spotxchange.com", name: "SpotX", impact: "high" },
      { pattern: "innovid.com", name: "Innovid", impact: "high" },
      { pattern: "teads.tv", name: "Teads", impact: "high" },
      // Content Discovery
      { pattern: "outbrain.com", name: "Outbrain", impact: "medium" },
      { pattern: "taboola.com", name: "Taboola", impact: "medium" },
      { pattern: "revcontent.com", name: "RevContent", impact: "medium" },
      { pattern: "zergnet.com", name: "ZergNet", impact: "medium" },
      { pattern: "dianomi.com", name: "Dianomi", impact: "medium" },
      { pattern: "plista.com", name: "Plista", impact: "medium" },
      // E-commerce Ads
      { pattern: "amazon-adsystem.com", name: "Amazon Ads", impact: "high" },
      { pattern: "shopping.google.com", name: "Google Shopping", impact: "medium" },
      { pattern: "merchant.com", name: "Merchant Center", impact: "medium" },
      { pattern: "shopify.com/analytics", name: "Shopify Analytics", impact: "medium" },
      { pattern: "affirm.com", name: "Affirm", impact: "medium" },
      { pattern: "klarna.com", name: "Klarna", impact: "medium" },
      { pattern: "afterpay.com", name: "Afterpay", impact: "medium" }
    ],
    fingerprinting: [
      // Device Fingerprinting
      { pattern: "fingerprintjs", name: "FingerprintJS", impact: "high" },
      { pattern: "canvas.fingerprint", name: "Canvas Fingerprinting", impact: "high" },
      { pattern: "webgl.fingerprint", name: "WebGL Fingerprinting", impact: "high" },
      { pattern: "audio.fingerprint", name: "Audio Fingerprinting", impact: "high" },
      { pattern: "deviceid", name: "Device ID", impact: "high" },
      { pattern: "visitorid", name: "Visitor ID", impact: "high" },
      { pattern: "securepubads", name: "SecurePubAds", impact: "high" },
      { pattern: "adsafeprotected", name: "AdSafe Protected", impact: "high" },
      { pattern: "moatads", name: "Moat Ads", impact: "high" },
      // Session Recording
      { pattern: "mouseflow.com", name: "Mouseflow", impact: "high" },
      { pattern: "fullstory.com", name: "FullStory", impact: "high" },
      { pattern: "sessioncam.com", name: "SessionCam", impact: "high" },
      { pattern: "smartlook.com", name: "Smartlook", impact: "high" },
      { pattern: "logrocket.com", name: "LogRocket", impact: "high" },
      { pattern: "quantum.com", name: "Quantum Metric", impact: "high" },
      { pattern: "sessionstack.com", name: "SessionStack", impact: "high" },
      { pattern: "hotjar.io", name: "Hotjar Recording", impact: "high" },
      { pattern: "mouseflow.io", name: "Mouseflow Recording", impact: "high" },
      // User Identification
      { pattern: "amplitude.com", name: "Amplitude", impact: "high" },
      { pattern: "mixpanel.com/track", name: "Mixpanel Tracking", impact: "high" },
      { pattern: "kissmetrics.com", name: "Kissmetrics", impact: "high" },
      { pattern: "optimizely.com", name: "Optimizely", impact: "high" },
      { pattern: "split.io", name: "Split.io", impact: "high" },
      { pattern: "launchdarkly.com", name: "LaunchDarkly", impact: "high" },
      { pattern: "flagsmith.com", name: "Flagsmith", impact: "high" },
      { pattern: "growthbook.io", name: "GrowthBook", impact: "high" }
    ],
    marketing: [
      // Marketing Automation
      { pattern: "marketo.com", name: "Marketo", impact: "high" },
      { pattern: "hubspot.com", name: "HubSpot", impact: "high" },
      { pattern: "tealium.com/audiencestream", name: "Tealium AudienceStream", impact: "high" },
      { pattern: "tealium.com/collect", name: "Tealium EventStream", impact: "high" },
      { pattern: "pardot.com", name: "Pardot", impact: "high" },
      { pattern: "eloqua.com", name: "Oracle Eloqua", impact: "high" },
      { pattern: "act-on.com", name: "Act-On", impact: "high" },
      { pattern: "salesforce.com", name: "Salesforce", impact: "high" },
      { pattern: "autopilothq.com", name: "Autopilot", impact: "medium" },
      { pattern: "activecampaign.com", name: "ActiveCampaign", impact: "high" },
      { pattern: "omnisend.com", name: "Omnisend", impact: "medium" },
      { pattern: "sendinblue.com", name: "Sendinblue", impact: "medium" },
      // Email Marketing
      { pattern: "mailchimp.com", name: "Mailchimp", impact: "medium" },
      { pattern: "sendgrid.net", name: "SendGrid", impact: "medium" },
      { pattern: "constantcontact.com", name: "Constant Contact", impact: "medium" },
      { pattern: "klaviyo.com", name: "Klaviyo", impact: "medium" },
      { pattern: "bronto.com", name: "Oracle Bronto", impact: "medium" },
      { pattern: "campaignmonitor.com", name: "Campaign Monitor", impact: "medium" },
      { pattern: "drip.com", name: "Drip", impact: "medium" },
      { pattern: "convertkit.com", name: "ConvertKit", impact: "medium" },
      { pattern: "aweber.com", name: "AWeber", impact: "medium" },
      { pattern: "getresponse.com", name: "GetResponse", impact: "medium" },
      // Chat & Support
      { pattern: "intercom.io", name: "Intercom", impact: "medium" },
      { pattern: "zendesk.com", name: "Zendesk", impact: "medium" },
      { pattern: "drift.com", name: "Drift", impact: "medium" },
      { pattern: "freshchat.com", name: "Freshchat", impact: "medium" },
      { pattern: "livechatinc.com", name: "LiveChat", impact: "medium" },
      { pattern: "olark.com", name: "Olark", impact: "medium" },
      { pattern: "tawk.to", name: "Tawk.to", impact: "medium" },
      { pattern: "helpscout.net", name: "Help Scout", impact: "medium" },
      { pattern: "gorgias.com", name: "Gorgias", impact: "medium" },
      { pattern: "crisp.chat", name: "Crisp", impact: "medium" }
    ]
  };
  var GEMINI_API_KEY = "";
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  var tabData = {};
  var genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  var model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  async function analyzeTrackingData(data) {
    try {
      const optimizedData = {
        requests: data.requests.map((req) => ({
          url: req.url.substring(0, 500),
          // Limit URL length
          type: req.type,
          method: req.method
        })).slice(0, 1e3),
        // Limit to 1000 requests
        cookies: data.cookies.slice(0, 500),
        // Limit to 500 cookies
        scripts: data.scripts.map((script) => ({
          src: script.src.substring(0, 500),
          // Limit source URL length
          content: script.content.substring(0, 1e3)
          // Limit content length
        })).slice(0, 200),
        // Limit to 200 scripts
        trackingPatterns: TRACKING_PATTERNS
      };
      const response = await fetch("https://v0-new-project-8slfauivs9j-1ei2ui.vercel.app/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: optimizedData })
      });
      if (!response.ok) {
        if (response.status === 413) {
          console.log("Retrying without script content...");
          const minimalData = {
            ...optimizedData,
            scripts: optimizedData.scripts.map((script) => ({
              src: script.src,
              content: ""
              // Remove script content
            }))
          };
          const retryResponse = await fetch("https://v0-new-project-8slfauivs9j-1ei2ui.vercel.app/api/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: minimalData })
          });
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const analysisData = await response.json();
      if (!analysisData.keyFindings || !Array.isArray(analysisData.keyFindings) || !analysisData.privacyConcerns || !Array.isArray(analysisData.privacyConcerns) || !analysisData.recommendations || !Array.isArray(analysisData.recommendations) || !analysisData.stats || typeof analysisData.stats !== "object" || !analysisData.detectedTrackers || !Array.isArray(analysisData.detectedTrackers)) {
        throw new Error("Invalid response structure");
      }
      return analysisData;
    } catch (error) {
      console.error("Error in analyzeTrackingData:", error);
      const detectedTrackers = data.requests.map((req) => detectTracker(req.url)).filter((tracker) => tracker !== null);
      const uniqueTrackers = Array.from(new Set(detectedTrackers.map((t) => t.name))).map(
        (name) => detectedTrackers.find((t) => t.name === name)
      );
      return {
        keyFindings: [
          `Detected ${uniqueTrackers.length} tracking services`,
          `Found ${uniqueTrackers.filter((t) => t.impact === "high").length} high-impact trackers`,
          `${data.cookies.length} tracking cookies identified`
        ],
        privacyConcerns: uniqueTrackers.filter((t) => t.impact === "high").map((t) => `${t.name} is known for extensive data collection`),
        recommendations: [
          "Consider using a privacy-focused browser extension",
          "Review cookie settings and clear them regularly",
          "Use private browsing mode for sensitive activities"
        ],
        stats: {
          totalTrackers: uniqueTrackers.length,
          highImpactTrackers: uniqueTrackers.filter((t) => t.impact === "high").length,
          cookiesDetected: data.cookies.length
        },
        detectedTrackers: uniqueTrackers.map((t) => ({
          category: t.category,
          name: t.name,
          impact: t.impact,
          source: "Network Request"
        }))
      };
    }
  }
  function detectTracker(url) {
    const lowerUrl = url.toLowerCase();
    for (const [category, patterns] of Object.entries(TRACKING_PATTERNS)) {
      for (const pattern of patterns) {
        const patternLower = pattern.pattern.toLowerCase();
        if (lowerUrl.includes(patternLower) || lowerUrl.includes(`//${patternLower}.`) || lowerUrl.includes(`.${patternLower}.`)) {
          return {
            name: pattern.name,
            category,
            impact: pattern.impact
          };
        }
      }
    }
    return null;
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeCurrentTab") {
      console.log("Starting analysis for current tab");
      (async () => {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab?.id || !tab?.url) {
            sendResponse({
              success: false,
              error: "Could not find the active tab. Please make sure you have a webpage open and try again."
            });
            return;
          }
          if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
            sendResponse({
              success: false,
              error: "This page cannot be analyzed. Please try on a regular website."
            });
            return;
          }
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const requests = [];
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === "resource") {
                    const resourceEntry = entry;
                    requests.push({
                      url: resourceEntry.name,
                      type: resourceEntry.initiatorType,
                      method: "GET"
                      // PerformanceAPI doesn't provide method info
                    });
                  }
                }
              });
              observer.observe({ entryTypes: ["resource"] });
              const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
              const scripts = Array.from(document.getElementsByTagName("script")).map((script) => ({
                src: script.src || "",
                content: script.innerHTML || ""
              }));
              return {
                requests,
                cookies,
                scripts
              };
            }
          });
          if (!results || !results[0]?.result) {
            throw new Error("Failed to collect tracking data");
          }
          const trackingData = results[0].result;
          const analysis = await analyzeTrackingData(trackingData);
          sendResponse({
            success: true,
            data: analysis
          });
        } catch (error) {
          console.error("Error in analysis:", error);
          sendResponse({
            success: false,
            error: "An unexpected error occurred. Please try again."
          });
        }
      })();
      return true;
    }
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabData[tabId];
  });
})();
/*! Bundled license information:

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
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
   *)

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
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
   *)
*/
//# sourceMappingURL=background.js.map

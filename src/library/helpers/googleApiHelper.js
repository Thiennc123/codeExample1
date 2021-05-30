export const loadScript = (url) => {
  let script = document.createElement("script");
  script.id = "google-api-script";
  script.type = "text/javascript";

  const createEvent = () => {
    var event = new CustomEvent('google-script-loaded');
    document.dispatchEvent(event);
  }

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        createEvent();
      }
    };
  } else {
    script.onload = createEvent;
  }

  script.src = url;
  if(!document.getElementById('google-api-script')){
    document.getElementsByTagName("head")[0].appendChild(script);
  }
};

SuperFastLazyLoad
=================

A pure javascript images lazy loader. And it's fast, really fast.  

## Install it

Download the zip or clone and add into you body:

```
<script type="text/javascript" src="/path/to/lazyload.min.js"></script>
```

## Using it

For each images that needs to be lazyloaded add an attribute. For example ```data-lazyload``` but you should use
anything else.The only thing required is the real image source ```data-src="/some/path/to/image"```

For example :
```<img src="/images/wheel-images.gif" data-src="/images/upload/realimage.jpg" alt="Sample" data-lazyload />```

Next Some where in your javascript (here on document loading with jQuery):

```
<script type="text/javascript">
    $(document).ready(function() {
        // The first argument is the element attribute, 
        // The second tell to transform it if because of the polyfill.
        // It will equal to [data-lazyload] but not recognized by the
        // polyfill. true is the default argument. 
        var lazyLoader = new LazyLoad('data-lazyload', true);
        
        // Apply on each images with the class loadme the 
        // lazy loader, and don't add brackets ( "[img.loadme]") 
        var anotherLoader = new LazyLoad('img.loadme', false);
    });
</script>
```

That's all!


## How fast

I've created a huge page with near 3000 images to watch. It takes less than a millisecond 
to determinate if an image must be displayed or not.

Launch index.html file to see an example. The sample will load always the same image to 
reduce the use of your bandwidth.
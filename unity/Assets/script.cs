using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class script : MonoBehaviour {
    Dictionary<string, GameObject> objects;

    void Start()
    {
        objects = new Dictionary<string, GameObject>(){
            {"pr", GameObject.Find("pr")},
            {"commit", GameObject.Find("commit")},
            {"slack", GameObject.Find("slack")}
        };

    }

    void Update()
    {
        if(Input.GetButton("Fire1")){
            addObject("pr");
        }

    }

    public void addObject(string objectType)
    {
        Instantiate(objects[objectType], new Vector3(Random.Range(-0.5f, 0.5f),20,0), Quaternion.identity);
    }
}

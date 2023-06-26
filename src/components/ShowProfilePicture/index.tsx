import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { User } from "../../stores";
import { observer } from "mobx-react";
import { OBRest, Restrictions } from "obrest";
import { Avatar } from "react-native-paper";
import { QUATERNARY_100, TERCIARY_100 } from "../../styles/colors";

interface Props {
  username: string;
  size: number;
}

const ShowProfilePicture = observer((props: Props) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const image = await getImage();
      setImage(image);
    };

    fetchImage();
  }, []);

  const getImage = async () => {
    let imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
    imageIdCriteria.add(Restrictions.equals("id", User.data.userId));
    let user: any = await imageIdCriteria.uniqueResult();
    let imageCriteria = OBRest.getInstance().createCriteria("ADImage");
    imageCriteria.add(Restrictions.equals("id", user.image));
    let image: any = await imageCriteria.list();
    return image;
  };

  const getInitials = function(string) {
    let names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <>
      {image &&
        image.map((imag) => {
          if (
            imag.bindaryData !== " " ||
            imag.bindaryData !== null ||
            imag.bindaryData !== undefined
          ) {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 80
                }}
              >
                <Avatar.Image
                  size={props.size}
                  source={{
                    uri: `data:image/jpeg;base64,${imag.bindaryData}`
                  }}
                />
              </View>
            );
          }
        })}

      {!image && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 80
          }}
        >
          <Avatar.Text
            size={props.size}
            label={getInitials(props.username)}
            style={{ backgroundColor: TERCIARY_100 }}
            labelStyle={{ color: QUATERNARY_100 }}
          />
        </View>
      )}
    </>
  );
});

export default ShowProfilePicture;
